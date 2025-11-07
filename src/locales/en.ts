export const en = {
  // Common
  common: {
    cancel: 'Cancel',
    save: 'Save',
    apply: 'Apply',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    search: 'Search',
    location: 'Location',
    type: 'Type',
    name: 'Name',
    status: 'Status',
    note: 'Note',
    layout: 'Layout',
    port: 'Port',
    ports: 'Ports',
    total: 'Total',
    rows: 'rows',
    cols: 'cols',
  },

  // Equipment
  equipment: {
    title: 'Network Equipment',
    add: 'Add Equipment',
    addNew: 'Add New Equipment',
    edit: 'Edit Equipment',
    delete: 'Delete Equipment',
    deleteConfirm: 'Are you sure you want to delete this equipment?',
    noEquipment: 'No equipment found.',
    addEquipmentPrompt: 'Please add equipment.',
    name: 'Equipment Name',
    namePlaceholder: 'e.g., Switch-01',
    nameRequired: 'Please enter equipment name.',
    locationPlaceholder: 'e.g., Server Room A Rack',
    typePlaceholder: 'e.g., Switch, Router',
    rows: 'Rows',
    cols: 'Columns',
    rowsRequired: 'Rows and columns must be at least 1.',
    portCount: 'ports will be created.',
    portCountEdit: 'ports will be available.',
    layoutWarning: '⚠️ Some port information may be deleted if the layout is reduced.',
  },

  // Port
  port: {
    title: 'Port Information',
    position: 'Position',
    batchRename: 'Batch Rename Ports',
    batchRenameTitle: 'Batch Rename Ports',
    namePattern: 'Name Pattern',
    namePatternPlaceholder: 'e.g., E1/1 or E1/1 - 2/24 or E{row}/{col}',
    namePatternRequired: 'Please enter name pattern.',
    supportedFormats: 'Supported Formats:',
    format1: '1. Start Format:',
    format1Example: 'E1/1',
    format1Desc: '→ E1/1, E1/2, E1/3... auto increment',
    format2: '2. Range Format:',
    format2Example: 'E1/1 - 2/24',
    format2Desc: '→ Range from E1/1 to E2/24',
    format3: '3. Template Format:',
    format3Example: 'E{row}/{col}',
    format3Desc: '→ Auto replace row/col numbers (row1col1 → E1/1)',
    patternNotRecognized: 'Pattern not recognized. Please check the format you entered.',
    supportedFormatsList: 'Supported Formats:',
    errorOccurred: 'An error occurred while changing port names.',
    namePlaceholder: 'e.g., Gi1/0/1',
    selectEquipment: 'Please select equipment',
    selectEquipmentDesc: 'Select equipment from the left list to display the port grid.',
    portCount: 'ports',
  },

  // Port Status
  portStatus: {
    normal: 'Normal',
    unused: 'Unused',
    check: 'Check Required',
    unspecified: 'Unspecified',
  },

  // Sidebar
  sidebar: {
    hide: 'Hide Sidebar',
    show: 'Show Sidebar',
  },

  // Dark Mode
  darkMode: {
    toggle: 'Switch to Dark Mode',
    toggleLight: 'Switch to Light Mode',
  },

  // Language
  language: {
    korean: '한국어',
    english: 'English',
    changeLanguage: 'Change Language',
  },

  // Filter
  filter: {
    search: 'Search',
    searchPlaceholder: 'Search by equipment name, location, type...',
    location: 'Location',
    type: 'Type',
    all: 'All',
    clearFilters: 'Clear Filters',
  },
};

