import { Paper, List } from '@mui/material';
import { ListItem } from '../../features/list/types';

interface ListContainerProps {
  items: ListItem[];
}

const ListContainer = ({ items }: ListContainerProps) => {
  return (
    <Paper elevation={2}>
      <List>
        {/* ListItem components will go here */}
      </List>
    </Paper>
  );
};

export default ListContainer;