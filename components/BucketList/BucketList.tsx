import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { getDatabase, ref, onValue, push, update, remove } from 'firebase/database';

interface BucketListItem {
    id: string;
    text: string;
}

const BucketList: React.FC = () => {
    const [items, setItems] = useState<BucketListItem[]>([]);
    const [newItemText, setNewItemText] = useState<string>('');
    const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

    const database = getDatabase();

    // Load items from Firebase on component mount
    useEffect(() => {
        const itemsRef = ref(database, 'bucketListItems');
        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itemsArray = Object.entries(data).map(([key, value]) => ({ id: key, text: value.text }));
                setItems(itemsArray);
            }
        });
    }, []);

    const handleAddItem = () => {
        if (newItemText.trim() !== '') {
            const newItemRef = push(ref(database, 'bucketListItems'), { text: newItemText });
            setNewItemText('');
        }
    };

    const handleUpdateItem = () => {
        if (editingItem) {
            update(ref(database, `bucketListItems/${editingItem.id}`), { text: newItemText });
            setEditModalVisible(false);
            setEditingItem(null);
        }
    };

    const handleDeleteItem = (id: string) => {
        remove(ref(database, `bucketListItems/${id}`));
    };

    const openEditModal = (item: BucketListItem) => {
        setEditingItem(item);
        setNewItemText(item.text);
        setEditModalVisible(true);
    };

    const closeEditModal = () => {
        setEditModalVisible(false);
        setEditingItem(null);
        setNewItemText('');
    };

    const renderItem = ({ item }: { item: BucketListItem }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <Text>{item.text}</Text>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => openEditModal(item)}>
                    <Text>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                    <Text>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View>
            <TextInput
                placeholder="Add new item"
                value={newItemText}
                onChangeText={setNewItemText}
            />
            <Button title="Add" onPress={handleAddItem} />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            <Modal visible={editModalVisible} animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        placeholder="Edit item"
                        value={newItemText}
                        onChangeText={setNewItemText}
                    />
                    <Button title="Update" onPress={handleUpdateItem} />
                    <Button title="Cancel" onPress={closeEditModal} />
                </View>
            </Modal>
        </View>
    );
};

export default BucketList;
