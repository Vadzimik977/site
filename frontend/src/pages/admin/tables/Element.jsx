import { List, Datagrid, TextField, EmailField, NumberField, BooleanField, ReferenceField, useFieldValue } from "react-admin";

export const ImgField = (props) => {
    const value = useFieldValue(props);
    console.log(value)
    return <img src={`/img/icon/${value}`} />
}
export default function Elements() {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="name" label="Имя" />
                <TextField source="symbol" label="Символ" />
                <TextField source="rare" label="Редкость" />
                <ImgField source="img" label="Картинка"/>
            </Datagrid>
        </List>
    );
}
