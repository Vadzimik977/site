import { List, Datagrid, TextField, EmailField } from "react-admin";

export default function Users() {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <EmailField source="email" />
                <TextField source="role" />
                <TextField source="wallet" />
                <TextField source="createdAt" />
            </Datagrid>
        </List>
    );
}
