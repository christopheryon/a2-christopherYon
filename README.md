Christopher Yon  
https://a2-christopheryon.onrender.com/

## Password Manager Prototype
My project is a single-page password manager application. The main page allows the user to create, edit, and delete password entries that are stored on the server, which calculates password strength in addition to storing passwords. Password entries are displayed in a table, and data entry takes place directly in the cells of the table for a seamless experience. For positioning, I used CSS flexbox in several places, including to vertically center the warning icon in the disclaimer, to manage the "+" and "New" text for the floating button in separate tags while keeping them side by side, and to center the disclaimer on the page. The main content container is also a flexbox with the items vertically stacked and uses the default left-alignment as a design choice, with a margin to keep everything away from the edge of the viewport.

## Technical Achievements
- **Single-Page Application** (5pts): The application is a single-page application, dynamically building the interface based on the server data on load and after the data is changed in any way. This was challenging because it required me to learn how to create and update DOM elements using only JavaScript through a combination of research and trial/error.
- **Data Modification** (5pts): The application allows the user to modify data in addition to creating and deleting it. The server component of this wasn't too challenging as it was similar to creating an item, only this time finding the item in the existing array and setting its fields to the new data. The client side was more difficult, as it required me to figure out how to properly target the item that was being edited (i.e. preserve an item ID on the client side), as well as effectively visually indicate which item was being edited by transforming the correct table row.
- **Extensive DOM Manipulation** (5pts): All data entry occurs in-place within the table cells, and the UI transforms itself based on what actions are current available in the current state. The best example of this is when editing a password, where the entry details are replaced with pre-filled input boxes, allowing the user to make changes to the item inside the same row that the static item previously occupied. This also applies to buttons, where all buttons besides the save and cancel buttons are hidden and disabled when editing an item as only one item is meant to be edited at a time. The most challenging part of this was figuring out how to target the correct items for modification, as well as deciding whether to hide or replace items to keep consistent spacing.

### Design/Evaluation Achievements
- **User Testing** (5pts):
  1. Last name: Murray
  2. What problems did the user have with your design?
     - Autocorrect in input fields interfered with data entry
     - Password strength was not rated until after saving password
     - The table changed size when entering edit mode
     - When the edit/delete buttons were replaced with save/cancel buttons, the buttons changed size due to the different text
     - The button animation felt sluggish
     - They felt that the enter key should be able to submit a completed entry
  3. What comments did they make that surprised you?
     - The issue with the input fields having spellcheck caught me off-guard, as they were using a different browser with more intrusive spellcheck behavior, so it had not caused issues in my own testing.
  4. What would you change about the interface based on their feedback?
     - I fixed the minor issues regarding button/table sizing and the button animations, as well as disabling spellcheck in the input fields.
     - I would definitely consider adding keyboard functionality if this were a more involved assignment. Similarly, I would also consider a password strength preview to be an improvement, although it being done server-side explicitly fulfills the server-side derived field requirement of this assignment.