// Mock API with simulated network latency

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data storage
let mockData = {
  courses: [
    { id: '1', code: 'CS101', title: 'Introduction to Programming', credits: 4, type: 'Major', hours: { theory: 3, practical: 2 } },
    { id: '2', code: 'MATH201', title: 'Calculus II', credits: 3, type: 'Major', hours: { theory: 3, practical: 0 } },
    { id: '3', code: 'ENG101', title: 'Technical Writing', credits: 2, type: 'Minor', hours: { theory: 2, practical: 0 } },
    { id: '4', code: 'CS202', title: 'Data Structures', credits: 4, type: 'Major', hours: { theory: 3, practical: 2 } },
    { id: '5', code: 'SKILL101', title: 'Communication Skills', credits: 2, type: 'Skill', hours: { theory: 2, practical: 0 } },
  ],
  faculty: [
    { id: '1', name: 'Dr. Sarah Johnson', expertise: ['Programming', 'Algorithms'], maxHours: 18, availability: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true } },
    { id: '2', name: 'Prof. Michael Chen', expertise: ['Mathematics', 'Statistics'], maxHours: 20, availability: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: true } },
    { id: '3', name: 'Dr. Emily Davis', expertise: ['English', 'Writing'], maxHours: 16, availability: { Monday: true, Tuesday: false, Wednesday: true, Thursday: true, Friday: true } },
    { id: '4', name: 'Prof. Robert Smith', expertise: ['Programming', 'Database'], maxHours: 18, availability: { Monday: true, Tuesday: true, Wednesday: true, Thursday: true, Friday: false } },
  ],
  rooms: [
    { id: '1', name: 'Room 101', capacity: 60, type: 'Lecture Hall' },
    { id: '2', name: 'Lab A', capacity: 30, type: 'Computer Lab' },
    { id: '3', name: 'Room 203', capacity: 50, type: 'Lecture Hall' },
    { id: '4', name: 'Lab B', capacity: 30, type: 'Computer Lab' },
    { id: '5', name: 'Auditorium', capacity: 200, type: 'Lecture Hall' },
  ],
  specialSchedules: [
    { id: '1', name: 'Internship Period', startDate: '2024-06-01', endDate: '2024-07-31', affectedGroups: ['Group A'] },
  ],
  timetable: {
    Monday: {
      '09:00': { id: 's1', courseId: '1', facultyId: '1', roomId: '1', isConflict: false },
      '11:00': { id: 's2', courseId: '2', facultyId: '2', roomId: '3', isConflict: false },
      '14:00': { id: 's3', courseId: '4', facultyId: '1', roomId: '2', isConflict: false },
    },
    Tuesday: {
      '09:00': { id: 's4', courseId: '3', facultyId: '3', roomId: '1', isConflict: false },
      '11:00': { id: 's5', courseId: '1', facultyId: '1', roomId: '2', isConflict: false },
    },
    Wednesday: {
      '09:00': { id: 's6', courseId: '2', facultyId: '2', roomId: '1', isConflict: false },
      '14:00': { id: 's7', courseId: '5', facultyId: '3', roomId: '3', isConflict: false },
    },
    Thursday: {
      '09:00': { id: 's8', courseId: '4', facultyId: '4', roomId: '2', isConflict: false },
      '11:00': { id: 's9', courseId: '2', facultyId: '2', roomId: '1', isConflict: false },
    },
    Friday: {
      '09:00': { id: 's10', courseId: '5', facultyId: '3', roomId: '1', isConflict: false },
      '11:00': { id: 's11', courseId: '1', facultyId: '1', roomId: '3', isConflict: false },
    },
  },
};

// Auth API
export const mockLogin = async ({ username, password }) => {
  await delay(800);
  if (username === 'coordinator' && password === 'password') {
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: { id: '1', name: 'Academic Coordinator', role: 'coordinator', email: 'coordinator@university.edu' },
    };
  }
  throw new Error('Invalid credentials');
};

// Courses API
export const fetchCourses = async () => {
  await delay(500);
  return [...mockData.courses];
};

export const createCourse = async (courseData) => {
  await delay(600);
  const newCourse = { ...courseData, id: Date.now().toString() };
  mockData.courses.push(newCourse);
  return newCourse;
};

export const updateCourse = async (id, data) => {
  await delay(600);
  const index = mockData.courses.findIndex((c) => c.id === id);
  if (index !== -1) {
    mockData.courses[index] = { ...mockData.courses[index], ...data };
    return mockData.courses[index];
  }
  throw new Error('Course not found');
};

export const deleteCourse = async (id) => {
  await delay(500);
  mockData.courses = mockData.courses.filter((c) => c.id !== id);
  return { success: true };
};

// Faculty API
export const fetchFaculty = async () => {
  await delay(500);
  return [...mockData.faculty];
};

export const createFaculty = async (facultyData) => {
  await delay(600);
  const newFaculty = { ...facultyData, id: Date.now().toString() };
  mockData.faculty.push(newFaculty);
  return newFaculty;
};

export const updateFaculty = async (id, data) => {
  await delay(600);
  const index = mockData.faculty.findIndex((f) => f.id === id);
  if (index !== -1) {
    mockData.faculty[index] = { ...mockData.faculty[index], ...data };
    return mockData.faculty[index];
  }
  throw new Error('Faculty not found');
};

export const deleteFaculty = async (id) => {
  await delay(500);
  mockData.faculty = mockData.faculty.filter((f) => f.id !== id);
  return { success: true };
};

// Rooms API
export const fetchRooms = async () => {
  await delay(500);
  return [...mockData.rooms];
};

export const createRoom = async (roomData) => {
  await delay(600);
  const newRoom = { ...roomData, id: Date.now().toString() };
  mockData.rooms.push(newRoom);
  return newRoom;
};

export const updateRoom = async (id, data) => {
  await delay(600);
  const index = mockData.rooms.findIndex((r) => r.id === id);
  if (index !== -1) {
    mockData.rooms[index] = { ...mockData.rooms[index], ...data };
    return mockData.rooms[index];
  }
  throw new Error('Room not found');
};

export const deleteRoom = async (id) => {
  await delay(500);
  mockData.rooms = mockData.rooms.filter((r) => r.id !== id);
  return { success: true };
};

// Special Schedules API
export const fetchSpecialSchedules = async () => {
  await delay(500);
  return [...mockData.specialSchedules];
};

export const createSpecialSchedule = async (scheduleData) => {
  await delay(600);
  const newSchedule = { ...scheduleData, id: Date.now().toString() };
  mockData.specialSchedules.push(newSchedule);
  return newSchedule;
};

export const updateSpecialSchedule = async (id, data) => {
  await delay(600);
  const index = mockData.specialSchedules.findIndex((s) => s.id === id);
  if (index !== -1) {
    mockData.specialSchedules[index] = { ...mockData.specialSchedules[index], ...data };
    return mockData.specialSchedules[index];
  }
  throw new Error('Schedule not found');
};

export const deleteSpecialSchedule = async (id) => {
  await delay(500);
  mockData.specialSchedules = mockData.specialSchedules.filter((s) => s.id !== id);
  return { success: true };
};

// Timetable API
export const fetchTimetable = async () => {
  await delay(700);
  return { ...mockData.timetable };
};

export const generateTimetable = async (params) => {
  await delay(3000); // Simulate AI processing
  // Return a mock generated timetable
  return { ...mockData.timetable };
};

export const updateTimetableSlot = async (day, time, data) => {
  await delay(500);
  if (!mockData.timetable[day]) {
    mockData.timetable[day] = {};
  }
  mockData.timetable[day][time] = data;
  return { day, time, data };
};
