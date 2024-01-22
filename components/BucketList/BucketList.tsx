import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

interface SwipeableItemProps {
    item: string;
    index: number;
    onDelete: (index: number) => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ item, index, onDelete }) => {
    const renderRightActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });

        return (
            <TouchableOpacity onPress={() => onDelete(index)}>
                <View style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item}</Text>
            </View>
        </Swipeable>
    );
};

const BucketList: React.FC = () => {
    const [items, setItems] = useState<string[]>([]);
    const [newItemText, setNewItemText] = useState<string>('');

    const addItem = () => {
        if (newItemText.trim() !== '') {
            setItems([...items, newItemText]);
            setNewItemText('');
        }
    };

    const removeItem = (index: number) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <SwipeableItem item={item} index={index} onDelete={removeItem} />
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Add new item..."
                value={newItemText}
                onChangeText={setNewItemText}
            />
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 16,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        padding: 10,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
    },
    itemText: {
        flex: 1,
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: "80%",
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default BucketList;
