import { List, Datagrid, TextField, EmailField, NumberField, ImageField, BooleanField } from "react-admin";

export default function Planets() {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <BooleanField source="active" />
                <TextField source="name" />
                <TextField source="symbol" />
                <NumberField source="speed" />
                <NumberField source="level" />
                <NumberField source="updatePrice" />
                <ImageField source="img" />
            </Datagrid>
        </List>
    );
}
