import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import Users from './tables/Users';
import simpleRestProvider from 'ra-data-simple-rest';
export default function AdminPage() {
    return (
        <Admin basename='/admin' dataProvider={simpleRestProvider('http://localhost:8000/api')}>
            <Resource name="users" list={Users} />
            <Resource name="wallets" list={Users} />
        </Admin>
    )
}