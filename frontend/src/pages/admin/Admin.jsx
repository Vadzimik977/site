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
import CreatePlanet from "./tables/CreatePlanet";
import CreateElement from "./tables/CreateElement";
import { authProvider } from "./authProvider";
import EditUser from "./tables/EditUser";
import CreateTask from "./tables/CreateTask";
import Tasks from "./tables/Tasks";
export default function AdminPage() {
    return (
        <Admin
            basename="/admin"
            dataProvider={simpleRestProvider(`${url}/api`)}
            authProvider={authProvider}
        >
            <Resource
                name="users"
                list={Users}
                edit={EditUser}
                options={{label: 'Пользователи'}}
                create={
                    <Create>
                        <SimpleForm>
                            <TextInput source="wallet"></TextInput>
                        </SimpleForm>
                    </Create>
                }
            />
            <Resource
                name="planets_admin"
                options={{label: 'Планеты'}}
                list={Planets}
                create={CreatePlanet}
                edit={EditPlanet}
                
            />
            <Resource
                name="elements"
                options={{label: 'Элементы'}}
                create={CreateElement}
                list={Elements}
            />
            <Resource 
                name="tasks"
                options={{label: 'Задания'}}
                create={CreateTask}
                list={Tasks}
            />
        </Admin>
    );
}
