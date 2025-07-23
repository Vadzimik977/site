import {
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    BooleanInput,
} from "react-admin";
export default function CreatePlanet() {
    return (
        <Create>
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
        </Create>
    );
}
