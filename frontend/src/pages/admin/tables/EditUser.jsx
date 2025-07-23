import { Edit, ImageInput, NumberInput, SimpleForm, TextInput, BooleanInput } from "react-admin";

export default function EditUser () {
    return (

    <Edit>
        <SimpleForm>
            <TextInput source="email" label="Почта" />
            <NumberInput source="ton" label="Тониум" />
            <NumberInput source='coins' label="GC" />
        </SimpleForm>
    </Edit>
    )
}