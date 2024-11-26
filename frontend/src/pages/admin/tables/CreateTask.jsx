import {
    Create,
    SimpleForm,
    TextInput,
    SelectInput
} from "react-admin";

export default function CreateTask() {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="amount" label="Вознаграждение" />
                <TextInput source="link" label="Ссылка" />
                <SelectInput
                    source="type"
                    label="Тип"
                    choices={[
                        {
                            id: "tgChannel",
                            name: "Телеграм канал",
                        },
                        {
                            id: "tgChat",
                            name: "Телеграм чат",
                        },
                        {
                            id: "video",
                            name: "Видео",
                        },
                    ]}
                />
            </SimpleForm>
        </Create>
    );
}
