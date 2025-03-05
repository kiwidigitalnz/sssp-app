/**
 * Utility functions for handling field name conversions between camelCase and snake_case
 */

// Define field mappings between camelCase and snake_case
export const fieldMappings: Record<string, string> = {
  // Emergency data fields
  'emergencyPlan': 'emergency_plan',
  'emergency_plan': 'emergency_plan',
  'emergencyContacts': 'emergency_contacts',
  'emergency_contacts': 'emergency_contacts',
  'assemblyPoints': 'assembly_points',
  'assembly_points': 'assembly_points',
  'emergencyEquipment': 'emergency_equipment',
  'emergency_equipment': 'emergency_equipment',
  'incidentReporting': 'incident_reporting',
  'incident_reporting': 'incident_reporting',
  
  // Project details fields
  'projectName': 'title',
  'title': 'title',
  'projectDescription': 'description',
  'description': 'description',
  'siteAddress': 'site_address',
  'site_address': 'site_address',
  'startDate': 'start_date',
  'start_date': 'start_date',
  'endDate': 'end_date',
  'end_date': 'end_date',
  
  // Company info fields
  'company_name': 'company_name',
  'companyName': 'company_name',
  'company_address': 'company_address',
  'companyAddress': 'company_address',
  'company_contact_name': 'company_contact_name',
  'companyContactName': 'company_contact_name',
  'company_contact_email': 'company_contact_email',
  'companyContactEmail': 'company_contact_email',
  'company_contact_phone': 'company_contact_phone',
  'companyContactPhone': 'company_contact_phone'
};

/**
 * Gets the value of a field, checking both camelCase and snake_case versions
 */
export const getFieldValue = (data: any, camelCase: string, snakeCase: string) => {
  return data?.[camelCase] || data?.[snakeCase] || "";
};

/**
 * Updates both camelCase and snake_case versions of a field
 */
export const updateBothCaseFields = (data: any, camelCase: string, snakeCase: string, value: any) => {
  return { 
    ...data, 
    [camelCase]: value,
    [snakeCase]: value
  };
};

/**
 * Standardizes field names in an object to ensure both camelCase and snake_case versions exist
 */
export const standardizeFieldNames = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  // Create a new object with standardized field names
  const result: Record<string, any> = { ...data };
  
  // Process each field in the data object
  Object.keys(data).forEach(key => {
    // Check if the key is in our mapping
    const standardKey = fieldMappings[key] || key;
    
    // If the value is an array, process each item in the array
    if (Array.isArray(data[key])) {
      result[standardKey] = data[key].map((item: any) => 
        typeof item === 'object' && item !== null ? standardizeFieldNames(item) : item
      );
    } 
    // If the value is an object (but not null), recursively standardize its fields
    else if (data[key] !== null && typeof data[key] === 'object') {
      result[standardKey] = standardizeFieldNames(data[key]);
    } 
    // Otherwise, just copy the value as is
    else {
      result[standardKey] = data[key];
    }
    
    // If the standardized key is different from the original key,
    // also keep the value under the original key for frontend compatibility
    if (standardKey !== key && !result[key]) {
      result[key] = result[standardKey];
    }
  });
  
  return result;
};

/**
 * Converts a camelCase string to snake_case
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Converts a snake_case string to camelCase
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
