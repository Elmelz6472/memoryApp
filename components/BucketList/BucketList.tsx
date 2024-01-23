import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Modal } from 'react-native';
import { Button, IconButton, List, Provider, useTheme, TextInput as PaperTextInput } from 'react-native-paper';
import { getDatabase, ref, onValue, push, update, remove } from 'firebase/database';
import app from '../../firebase-config';

interface BucketListItem {
    id: string;
    text: string;
    createdAt: number;
    completed: boolean;
}

const BucketList: React.FC = () => {
    const [items, setItems] = useState<BucketListItem[]>([]);
    const [newItemText, setNewItemText] = useState<string>('');
    const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

    const database = getDatabase(app);
    const theme = useTheme();

    useEffect(() => {
        const itemsRef = ref(database, 'bucketListItems');
        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itemsArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    text: value.text,
                    createdAt: value.createdAt,
                    completed: value.completed || false,
                }));
                setItems(itemsArray);
            }
        });
    }, []);

    const handleAddItem = () => {
        if (newItemText.trim() !== '') {
            const newItemRef = push(ref(database, 'bucketListItems'), {
                text: newItemText,
                createdAt: Date.now(),
                completed: false,
            });
            setNewItemText('');
        }
    };

    const handleUpdateItem = () => {
        if (editingItem && !editingItem.completed) {
            update(ref(database, `bucketListItems/${editingItem.id}`), {
                text: newItemText,
            });
            setEditModalVisible(false);
            setEditingItem(null);
            setNewItemText('');
        }
    };

    const handleDeleteItem = (id: string) => {
        const itemRef = ref(database, `bucketListItems/${id}`);

        // Remove the item from Firebase
        remove(itemRef).then(() => {
            // Check if it was the last item
            if (items.length === 1) {
                setItems([]);
            } else {
                // Update the state excluding the deleted item
                setItems((prevItems) => prevItems.filter((item) => item.id !== id));
            }
        }).catch((error) => {
            console.error("Error removing item: ", error);
        });
    };

    const handleToggleComplete = (id: string) => {
        update(ref(database, `bucketListItems/${id}`), {
            completed: true,
        });
    };

    const openEditModal = (item: BucketListItem) => {
        // Allow editing only if the item is not completed
        if (!item.completed) {
            setEditingItem(item);
            setNewItemText(item.text);
            setEditModalVisible(true);
        }
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        setEditingItem(null);
        setNewItemText('');
    };

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
                        icon="pencil"
                        color={item.completed ? theme.colors.disabled : theme.colors.primary}
                        onPress={() => openEditModal(item)}
                        disabled={item.completed}
                    />
                    <IconButton
                        icon="delete"
                        color={theme.colors.error}
                        onPress={() => handleDeleteItem(item.id)}
                    />
                </View>
            )}
            style={{ backgroundColor: item.completed ? '#e0f7f0' : 'transparent' }}
        />
    );

    return (
        <Provider>
            <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
                <PaperTextInput
                    label="New Item"
                    value={newItemText}
                    onChangeText={setNewItemText}
                    style={{ marginBottom: 16 }}
                    theme={{ colors: { primary: theme.colors.primary } }}
                />
                <Button mode="contained" onPress={handleAddItem} style={{ marginBottom: 16 }}>
                    Add
                </Button>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />

                <Modal visible={editModalVisible} animationType="slide">
                    <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff' }}>
                        <PaperTextInput
                            label="Edit item"
                            value={newItemText}
                            onChangeText={setNewItemText}
                            style={{ marginBottom: 16 }}
                            theme={{ colors: { primary: theme.colors.primary } }}
                            disabled={editingItem?.completed}
                        />
                        <Button
                            mode="contained"
                            onPress={handleUpdateItem}
                            style={{ marginBottom: 16 }}
                            disabled={editingItem?.completed}
                        >
                            Update
                        </Button>
                        <Button mode="outlined" onPress={closeEditModal}>
                            Cancel
                        </Button>
                    </View>
                </Modal>
            </View>
        </Provider>
    );
};

export default BucketList;
