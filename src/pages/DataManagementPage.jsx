import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Tabs, Tab, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon, Upload as UploadIcon, MoreVert as MoreIcon } from '@mui/icons-material';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ExportMenu from '../components/ExportMenu';
import ImportDialog from '../components/ImportDialog';
import { toast } from 'react-toastify';
import { logActivity } from '../components/ActivityFeed';
import {
  fetchCoursesAsync,
  createCourseAsync,
  updateCourseAsync,
  deleteCourseAsync,
} from '../app/slices/coursesSlice';
import {
  fetchFacultyAsync,
  createFacultyAsync,
  updateFacultyAsync,
  deleteFacultyAsync,
} from '../app/slices/facultySlice';
import {
  fetchRoomsAsync,
  createRoomAsync,
  updateRoomAsync,
  deleteRoomAsync,
} from '../app/slices/roomsSlice';
import {
  fetchSpecialSchedulesAsync,
  createSpecialScheduleAsync,
  updateSpecialScheduleAsync,
  deleteSpecialScheduleAsync,
} from '../app/slices/specialSchedulesSlice';

const dataTypeConfig = {
  courses: {
    label: 'Courses',
    columns: [
      { field: 'code', headerName: 'Course Code', width: 120 },
      { field: 'title', headerName: 'Title', flex: 1 },
      { field: 'credits', headerName: 'Credits', width: 100 },
      { field: 'type', headerName: 'Type', width: 120 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        renderCell: (params) => params.value,
      },
    ],
    fields: [
      { name: 'code', label: 'Course Code', rules: { required: 'Required' } },
      { name: 'title', label: 'Course Title', rules: { required: 'Required' }, fullWidth: true },
      { name: 'credits', label: 'Credits', type: 'number', rules: { required: 'Required' } },
      { name: 'type', label: 'Type', select: true, rules: { required: 'Required' }, SelectProps: { native: true }, options: [
        { value: '', label: 'Select Type' },
        { value: 'Major', label: 'Major' },
        { value: 'Minor', label: 'Minor' },
        { value: 'Skill', label: 'Skill' },
      ]},
      { name: 'hours.theory', label: 'Theory Hours', type: 'number' },
      { name: 'hours.practical', label: 'Practical Hours', type: 'number' },
    ],
  },
  faculty: {
    label: 'Faculty',
    columns: [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'expertise', headerName: 'Expertise', flex: 1, valueGetter: (params) => params.row.expertise?.join(', ') },
      { field: 'maxHours', headerName: 'Max Hours', width: 120 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        renderCell: (params) => params.value,
      },
    ],
    fields: [
      { name: 'name', label: 'Faculty Name', rules: { required: 'Required' }, fullWidth: true },
      { name: 'expertise', label: 'Expertise (comma-separated)', fullWidth: true },
      { name: 'maxHours', label: 'Maximum Hours', type: 'number', rules: { required: 'Required' } },
    ],
  },
  rooms: {
    label: 'Rooms',
    columns: [
      { field: 'name', headerName: 'Room Name', flex: 1 },
      { field: 'capacity', headerName: 'Capacity', width: 120 },
      { field: 'type', headerName: 'Type', width: 180 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        renderCell: (params) => params.value,
      },
    ],
    fields: [
      { name: 'name', label: 'Room Name', rules: { required: 'Required' } },
      { name: 'capacity', label: 'Capacity', type: 'number', rules: { required: 'Required' } },
      { name: 'type', label: 'Type', select: true, rules: { required: 'Required' }, SelectProps: { native: true }, options: [
        { value: '', label: 'Select Type' },
        { value: 'Lecture Hall', label: 'Lecture Hall' },
        { value: 'Computer Lab', label: 'Computer Lab' },
      ]},
    ],
  },
  schedules: {
    label: 'Special Schedules',
    columns: [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'startDate', headerName: 'Start Date', width: 150 },
      { field: 'endDate', headerName: 'End Date', width: 150 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        renderCell: (params) => params.value,
      },
    ],
    fields: [
      { name: 'name', label: 'Schedule Name', rules: { required: 'Required' }, fullWidth: true },
      { name: 'startDate', label: 'Start Date', type: 'date', rules: { required: 'Required' } },
      { name: 'endDate', label: 'End Date', type: 'date', rules: { required: 'Required' } },
      { name: 'affectedGroups', label: 'Affected Groups (comma-separated)' },
    ],
  },
};

const DataManagementPage = () => {
  const { dataType = 'courses' } = useParams();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  const coursesData = useSelector((state) => state.courses);
  const facultyData = useSelector((state) => state.faculty);
  const roomsData = useSelector((state) => state.rooms);
  const schedulesData = useSelector((state) => state.specialSchedules);

  const stateMap = {
    courses: coursesData,
    faculty: facultyData,
    rooms: roomsData,
    schedules: schedulesData,
  };

  const actionMap = {
    courses: { fetch: fetchCoursesAsync, create: createCourseAsync, update: updateCourseAsync, delete: deleteCourseAsync },
    faculty: { fetch: fetchFacultyAsync, create: createFacultyAsync, update: updateFacultyAsync, delete: deleteFacultyAsync },
    rooms: { fetch: fetchRoomsAsync, create: createRoomAsync, update: updateRoomAsync, delete: deleteRoomAsync },
    schedules: { fetch: fetchSpecialSchedulesAsync, create: createSpecialScheduleAsync, update: updateSpecialScheduleAsync, delete: deleteSpecialScheduleAsync },
  };

  const currentState = stateMap[dataType];
  const currentActions = actionMap[dataType];
  const config = dataTypeConfig[dataType];

  useEffect(() => {
    dispatch(currentActions.fetch());
  }, [dispatch, dataType]);

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await dispatch(currentActions.delete(id)).unwrap();
        logActivity('delete', `Deleted ${config.label.slice(0, -1).toLowerCase()}`, dataType);
        toast.success('Deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleImport = async (data) => {
    for (const item of data) {
      await dispatch(currentActions.create(item)).unwrap();
    }
    logActivity('create', `Imported ${data.length} ${config.label.toLowerCase()}`, dataType);
    dispatch(currentActions.fetch());
  };

  const handleSubmit = async (data) => {
    try {
      // Process expertise and affectedGroups from comma-separated strings
      if (data.expertise && typeof data.expertise === 'string') {
        data.expertise = data.expertise.split(',').map(s => s.trim());
      }
      if (data.affectedGroups && typeof data.affectedGroups === 'string') {
        data.affectedGroups = data.affectedGroups.split(',').map(s => s.trim());
      }
      
      // Handle nested hours object for courses
      if (data['hours.theory'] !== undefined || data['hours.practical'] !== undefined) {
        data.hours = {
          theory: parseInt(data['hours.theory']) || 0,
          practical: parseInt(data['hours.practical']) || 0,
        };
        delete data['hours.theory'];
        delete data['hours.practical'];
      }

      if (editingItem) {
        await dispatch(currentActions.update({ id: editingItem.id, data })).unwrap();
        logActivity('update', `Updated ${config.label.slice(0, -1).toLowerCase()}`, dataType);
        toast.success('Updated successfully!');
      } else {
        await dispatch(currentActions.create(data)).unwrap();
        logActivity('create', `Created new ${config.label.slice(0, -1).toLowerCase()}`, dataType);
        toast.success('Created successfully!');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const rows = currentState.data.map((item) => ({
    ...item,
    actions: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton size="small" onClick={() => handleEdit(item)} sx={{ color: 'hsl(220 70% 50%)' }}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ color: 'hsl(0 72% 55%)' }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  }));

  // Prepare default values for editing
  const defaultValues = editingItem ? {
    ...editingItem,
    expertise: editingItem.expertise?.join(', '),
    affectedGroups: editingItem.affectedGroups?.join(', '),
    'hours.theory': editingItem.hours?.theory,
    'hours.practical': editingItem.hours?.practical,
  } : {};

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Tabs value={dataType}>
          {Object.entries(dataTypeConfig).map(([key, { label }]) => (
            <Tab key={key} label={label} value={key} onClick={() => window.location.href = `/manage/${key}`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setImportOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            Import CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={(e) => setExportAnchor(e.currentTarget)}
            sx={{ textTransform: 'none' }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(135deg, hsl(220 70% 50%), hsl(265 60% 55%))',
              '&:hover': {
                background: 'linear-gradient(135deg, hsl(220 70% 45%), hsl(265 60% 50%))',
              },
            }}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <DataTable columns={config.columns} rows={rows} loading={currentState.status === 'loading'} />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={`${editingItem ? 'Edit' : 'Add'} ${config.label.slice(0, -1)}`}
        fields={config.fields}
        defaultValues={defaultValues}
      />

      <ExportMenu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
        data={currentState.data}
        type={config.label}
      />

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        dataType={config.label}
      />
    </Box>
  );
};

export default DataManagementPage;
