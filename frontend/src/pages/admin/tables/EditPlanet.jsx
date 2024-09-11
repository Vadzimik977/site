import { Edit, ImageInput, NumberInput, SimpleForm, TextInput, BooleanInput } from "react-admin";

export default function EditPlanet () {
    return (

    <Edit>
        <SimpleForm>
            <BooleanInput source="active" label="Активность" />
            <TextInput source="name" label="Имя" />
            <NumberInput source="speed" label="Скорость" />
            <NumberInput
                source="updatePrice"
                label="Стоимость обновления"
            />
            <TextInput source="img" label="Картинка" />
        </SimpleForm>
    </Edit>
    )
}