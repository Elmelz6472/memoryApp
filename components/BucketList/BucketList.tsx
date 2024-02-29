import 'react-native-url-polyfill/auto'

import React, { useState, useEffect } from 'react'
import { View, TextInput, FlatList, Modal } from 'react-native'
import { v4 as uuidv4 } from 'uuid';

import {
    Button,
    IconButton,
    List,
    Provider,
    useTheme,
    TextInput as PaperTextInput,
} from 'react-native-paper'

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sirlqwdaqozkyiibvzkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcmxxd2RhcW96a3lpaWJ2emt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkxODE1NTcsImV4cCI6MjAyNDc1NzU1N30.jdliASH5XhqUnWej0VpD09ku-VyL7TwOQoFa0Ldhn2w';
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);



interface BucketListItem {
    id: string
    text: string
    createdAt: number
    completed: boolean
}

const BucketList: React.FC = () => {
    const [items, setItems] = useState<BucketListItem[]>([])
    const [newItemText, setNewItemText] = useState<string>('')
    const [editingItem, setEditingItem] = useState<BucketListItem | null>(null)
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false)

    const theme = useTheme()



    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data: initialItems, error } = await supabaseClient
                    .from('bucketListItems')
                    .select('*');

                if (error) {
                    console.error('Error fetching initial items:', error);
                } else {
                    if (initialItems) {
                        setItems(initialItems);
                    }
                }
            } catch (error: any) {
                console.error('Error fetching initial items:', error.message);
            }
        };

        fetchItems();

        // Set up real-time subscription using Supabase channels
        const insertSubscription = supabaseClient
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'bucketListItems' },
                (payload) => {
                    // console.log('New item:', payload.new);

                    const newItem: BucketListItem = {
                        id: payload.new.id,
                        text: payload.new.text,
                        createdAt: payload.new.createdAt,
                        completed: payload.new.completed
                    };

                    // Add the new item to the state immediately
                    setItems(prevItems => [...prevItems, newItem]);
                }
            )
            .subscribe();



        const deleteSubscription = supabaseClient
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'bucketListItems' },
                (payload) => {
                    // console.log('Change received!', payload);
                    setItems(prevItems => prevItems.filter(item => item.id !== payload.old.id));
                }
            )
            .subscribe();


        const updateSubscription = supabaseClient
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'bucketListItems' },
                (payload) => {
                    // console.log('Change received!', payload);
                    if ('new' in payload && payload.new && 'id' in payload.new) {
                        setItems(prevItems => prevItems.map(item => {
                            if (item.id === payload.new.id) {
                                return payload.new as BucketListItem; // Type assertion
                            }
                            return item;
                        }));
                    }
                }
            ).subscribe();

        // Clean up subscription
        return () => {
            insertSubscription.unsubscribe();
            deleteSubscription.unsubscribe();
            updateSubscription.unsubscribe();

        };
    }, []);




    const handleAddItem = async () => {
        if (newItemText.trim() !== '') {
            const createdAt = new Date().toISOString(); // Format current date/time to ISO 8601
            const newItemId = uuidv4(); // Generate a unique ID
            const { data, error } = await supabaseClient
                .from('bucketListItems')
                .insert({ id: newItemId, text: newItemText, createdAt, completed: false });

            if (error) {
                console.error('Error adding item:', error);
            } else {
                // Add the new item to the state immediately

                // @ts-ignore
                setItems(prevItems => [...prevItems, { id: newItemId, text: newItemText, createdAt, completed: false }]);
                setNewItemText('');
            }
        }
    }

    const handleUpdateItem = async () => {
        if (editingItem && !editingItem.completed) {
            const { data, error } = await supabaseClient
                .from('bucketListItems')
                .update({ text: newItemText })
                .match({ id: editingItem.id });


            setEditModalVisible(false)
            setEditingItem(null)
            setNewItemText('')
        }
    }

    const handleDeleteItem = async (id: string) => {
        try {
            const { data, error } = await supabaseClient
                .from('bucketListItems')
                .delete()
                .match({ id: id });

            if (error) {
                console.error('Error deleting item:', error);
            } else {
                // Remove the deleted item from the state
                setItems(prevItems => prevItems.filter(item => item.id !== id));
            }
        } catch (error: any) {
            console.error('Error deleting item:', error.message);
        }
    }



    const handleToggleComplete = async (id: string) => {
        const { data, error } = await supabaseClient
            .from('bucketListItems')
            .update({ completed: true })
            .match({ id: id });
    }

    const openEditModal = (item: BucketListItem) => {
        // Allow editing only if the item is not completed
        if (!item.completed) {
            setEditingItem(item)
            setNewItemText(item.text)
            setEditModalVisible(true)
        }
    }

    const closeEditModal = () => {
        setEditModalVisible(false)
        setEditingItem(null)
        setNewItemText('')
    }

    const renderItem = ({ item }: { item: BucketListItem }) => (
        <List.Item
            title={item.text}
            description={new Date(item.createdAt).toLocaleDateString()}
            onPress={() => openEditModal(item)}
            left={(props) => (
                <IconButton
                    icon={item.completed ? 'check-circle' : 'circle-outline'}
                    color={item.completed ? '#4CAF50' : theme.colors.primary}
                    onPress={() => handleToggleComplete(item.id)}
                />
            )}
            right={() => (
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon='pencil'
                        color={item.completed ? theme.colors.disabled : theme.colors.primary}
                        onPress={() => openEditModal(item)}
                        disabled={item.completed}
                    />
                    <IconButton
                        icon='delete'
                        color={theme.colors.error}
                        onPress={() => handleDeleteItem(item.id)}
                    />
                </View>
            )}
            style={{ backgroundColor: item.completed ? '#e0f7f0' : 'transparent' }}
        />
    )

    return (
        <Provider>
            <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
                <PaperTextInput
                    label='New Item'
                    value={newItemText}
                    onChangeText={setNewItemText}
                    style={{ marginBottom: 16 }}
                    theme={{ colors: { primary: theme.colors.primary } }}
                />
                <Button mode='contained' onPress={handleAddItem} style={{ marginBottom: 16 }}>
                    Add
                </Button>
                <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.id} />

                <Modal visible={editModalVisible} animationType='slide'>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            padding: 16,
                            backgroundColor: '#fff',
                        }}
                    >
                        <PaperTextInput
                            label='Edit item'
                            value={newItemText}
                            onChangeText={setNewItemText}
                            style={{ marginBottom: 16 }}
                            theme={{ colors: { primary: theme.colors.primary } }}
                            disabled={editingItem?.completed}
                        />
                        <Button
                            mode='contained'
                            onPress={handleUpdateItem}
                            style={{ marginBottom: 16 }}
                            disabled={editingItem?.completed}
                        >
                            Update
                        </Button>
                        <Button mode='outlined' onPress={closeEditModal}>
                            Cancel
                        </Button>
                    </View>
                </Modal>
            </View>
        </Provider>
    )
}

export default BucketList
