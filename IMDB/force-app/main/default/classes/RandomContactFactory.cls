public class RandomContactFactory {

    // Public static method to generate a list of contacts
    public static List<Contact> generateRandomContacts(Integer numberOfContacts, String commonLastName) {
        // Initialize an empty list to hold the contacts
        List<Contact> contacts = new List<Contact>();

        

        // Generate contacts with unique first names and the provided last name
        for (Integer i = 0; i < numberOfContacts; i++) {
            // Create a new Contact object
            Contact newContact = new Contact();
            // Set the unique first name
            newContact.FirstName = 'Test ' + i;
            // Set the common last name
            newContact.LastName = commonLastName;
            // Add the contact to the list
            contacts.add(newContact);
        }

        // Return the list of generated contacts
        return contacts;
    }
}