import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import Users from './tables/Users';
import simpleRestProvider from 'ra-data-simple-rest';
import Planets from './tables/Planet';
import EditPlanet from './tables/EditPlanet';
export default function AdminPage() {
    return (
        <Admin basename='/admin' dataProvider={simpleRestProvider('http://localhost:8000/api')}>
            return
            <Resource name="users" list={Users} />
            <Resource name="planets" list={Planets} edit={EditPlanet} />
        </Admin>
    )
}