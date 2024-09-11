import { Edit, ImageInput, NumberInput, SimpleForm, TextInput } from "react-admin";

export default function EditPlanet () {
    return (

    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="symbol" />
            <NumberInput source="speed" />
            <NumberInput source="updatePrice" />
            <TextInput source="img" />
        </SimpleForm>
    </Edit>
    )
}