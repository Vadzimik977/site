import { List, Datagrid, TextField, useFieldValue } from "react-admin";

export const ImgField = (props) => {
    const value = useFieldValue(props);
    return <img src={`/img/icon/${value}`} />
}

const TypeField = (props) => {
    const value = useFieldValue(props);
    switch(value) {
        case 'tgChannel':
            return 'Телеграм канал';
        case 'tgChat':
            return 'Телеграм чат';
        case 'video':
            return 'Видео';
    }
}
export default function Task() {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="amount" label="Вознаграждение" />
                <TextField source="link" label="Ссылка" />
                <TypeField source="type" label="Тип" />
            </Datagrid>
        </List>
    );
}
