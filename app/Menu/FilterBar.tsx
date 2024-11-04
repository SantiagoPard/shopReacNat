import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { foodData } from '../../constants/foodData';

type FilterType = {
  category: string;
};

type FilterBarProps = {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter }) => {
  const categories = Array.from(new Set(foodData.map(food => food.category)));

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={filter.category}
        onValueChange={(value: string) =>
          setFilter((prev) => ({ ...prev, category: value }))
        }
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Todas las Categorías" value="" />
        {categories.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: 200,
  },
  pickerItem: {
    height: 21,
  },
});

export default FilterBar;
