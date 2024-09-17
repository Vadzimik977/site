import { List, Datagrid, TextInput, TextField, EmailField, NumberField, BooleanField, ReferenceField, useFieldValue } from "react-admin";

export const ImgField = (props) => {
    const value = useFieldValue(props);
    console.log(value)
    return <img src={`/img/planet/${value}`} />
}
export default function Planets() {
    return (
        <List filters={[<TextInput source="name" label="Поиск" alwaysOn />]}>
            <Datagrid>
                <TextField source="id" />
                <TextField source="active" label="Активность"/>
                <TextField source="name" label="Имя" />
                <TextField source="element.name" label="Элемент"></TextField>
                <NumberField source="speed" label="Скорость" />
                <NumberField source="updatePrice" label="Стоимость обновления" />
                <ImgField source="img" label="Картинка"/>
            </Datagrid>
        </List>
    );
}
