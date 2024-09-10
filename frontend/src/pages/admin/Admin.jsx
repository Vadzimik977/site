import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, Create, SimpleForm, TextInput } from 'react-admin';
import Users from './tables/Users';
import simpleRestProvider from 'ra-data-simple-rest';
import Planets from './tables/Planet';
import EditPlanet from './tables/EditPlanet';
export default function AdminPage() {
    return (
        <Admin basename='/admin' dataProvider={simpleRestProvider('http://localhost:8000/api')}>
            return
            <Resource name="users" list={Users} create={<Create><SimpleForm><TextInput source='wallet'></TextInput></SimpleForm></Create>} />
            <Resource name="planets" list={Planets} edit={EditPlanet} />
            <Resource name="elements" list={ListGuesser} edit={EditPlanet} />
        </Admin>
    )
}