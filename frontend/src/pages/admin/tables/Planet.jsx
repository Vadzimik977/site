import { List, Datagrid, TextField, EmailField, NumberField, ImageField, BooleanField, ReferenceField } from "react-admin";

export default function Planets() {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="active" label="Активность"/>
                <TextField source="name" label="Имя" />
                <TextField source="element.name" label="Элемент"></TextField>
                <NumberField source="speed" label="Скорость" />
                <NumberField source="updatePrice" label="Стоимость обновления" />
                <ImageField source="img" src={(val) => `/images/${val}`} label="Изображение" />
            </Datagrid>
        </List>
    );
}
