import { List, Datagrid, TextField, EmailField,  } from "react-admin";

export default function Users() {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <EmailField source="email" />
                <TextField source="role" label="Роль"/>
                <TextField source="ton" label="Тониум"/>
                <TextField source="coins" label="GC"/>
                <TextField source="adress" label="Кошелёк" />
            </Datagrid>
        </List>
    );
}
