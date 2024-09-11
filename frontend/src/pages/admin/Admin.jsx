import {
    Admin,
    Resource,
    ListGuesser,
    EditGuesser,
    ShowGuesser,
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    SelectInput,
    BooleanInput,
} from "react-admin";
import Users from "./tables/Users";
import simpleRestProvider from "ra-data-simple-rest";
import Planets from "./tables/Planet";
import EditPlanet from "./tables/EditPlanet";
import Elements from "./tables/Element";
import { url } from "../../utils/axios";
export default function AdminPage() {
    return (
        <Admin
            basename="/admin"
            dataProvider={simpleRestProvider(`${url}/api`)}
        >
            return
            <Resource
                name="users"
                list={Users}
                create={
                    <Create>
                        <SimpleForm>
                            <TextInput source="wallet"></TextInput>
                        </SimpleForm>
                    </Create>
                }
            />
            <Resource
                name="planets"
                list={Planets}
                create={
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
                }
                edit={EditPlanet}
            />
            <Resource
                name="elements"
                create={
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
                }
                list={Elements}
            />
        </Admin>
    );
}
