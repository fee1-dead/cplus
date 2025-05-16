# C+ Project Planner

### Investigation overview

**Scope**: All Special:CheckUser pages

**Summary**: Provides an overview of the current investigation in progress

**Specification**: An area should be placed the after #checkuserform element, initially prompting the user to start a new session. Sessions can be automatically named through reading the reason field inside checkuserform, or the user can write their own names. Data related to a single investigation should be stored locally. This data should be deleted when the user leaves either by closing all tabs or through ending the session. Investigation data includes all CU log entries encountered for the investigation as well as custom user-populated lists of IP (ranges) and/or users. When a tab is closed, it is assumed the CU log entries on that tab should then be deleted. 

### Adding entries to lists

**Scope**: Active investigations

**Summary**: Allows users to add IP addresses, ranges, and users to custom lists

**Specification**: For "Get IP addressses", this should be in the form of a small link at the very start of each list item as "[+]". For "Get actions", this can be done by adding a column in front of `.mw-checkuser-helper-fieldset` with "[+]" link for each row, as well as "+" link inside each `.mw-usertoollinks`. When the link is clicked on any of those, a small dialog should open asking the user to select a list to add to. For "Get users" TODO.

### Investigation result exporting

**Scope**: Active investigations, SPI case pages

**Summary**: Allows users to export investigation results formatted either for cuwiki or for public SPI case posting 

**Specification**: A button with a name or icon meaning "Export" that allows the user to choose how they want a _list_ to be copied to a clipboard: as a `{{socklist|Foo|Bar}}` which only lists named accounts, or as a cuwiki formatted table which includes all CU logs that have been collected on the accounts and IPs. 

### Foo

**Scope**:

**Summary**:

**Specification**: