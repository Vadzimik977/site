import {
    Create,
    SimpleForm,
    TextInput,
    SelectInput
} from "react-admin";

export default function CreateElement() {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="name" label="Имя" />
                <TextInput source="symbol" label="Символ" />
                <TextInput source="img" label="Картинка" />
                <SelectInput
                    source="rare"
                    label="Редкость"
                    choices={[
                        {
                            id: "Обычная",
                            name: "Обычная",
                        },
                        {
                            id: "Редкая",
                            name: "Редкая",
                        },
                        {
                            id: "Эпическая",
                            name: "Эпическая",
                        },
                    ]}
                />
            </SimpleForm>
        </Create>
    );
}
