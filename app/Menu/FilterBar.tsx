import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type FilterType = {
  type: string;
  category: string;
};

type FilterBarProps = {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter }) => {
  return (
    <View>
      <Picker
        selectedValue={filter.type}
        onValueChange={(value: string) =>
          setFilter((prev) => ({ ...prev, type: value }))
        }
      >
        <Picker.Item label="Todas las Bebidas" value="" />
        <Picker.Item label="Comida Rápida" value="Comida Rápida" />
        <Picker.Item label="Comida Saludable" value="Comida Saludable" />
      </Picker>

      <Picker
        selectedValue={filter.category}
        onValueChange={(value: string) =>
          setFilter((prev) => ({ ...prev, category: value }))
        }
      >
        <Picker.Item label="Todas las Categorías" value="" />
        <Picker.Item label="Sopas" value="Sopas" />
        <Picker.Item label="Platos del Día" value="Día" />
        <Picker.Item label="A la Carta" value="Carta" />
        <Picker.Item label="Menú Infantil" value="Infantil" />
      </Picker>
    </View>
  );
};

export default FilterBar;
