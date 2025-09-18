# Changelog

**Repository:** `LISA`  
**Description:** `Tracks all notable changes, version history, and roadmap toward 1.0.0 following Semantic Versioning.`  
**SPDX-License-Identifier:** OGL-UK-3.0

All notable changes to this repository will be documented in this file.
This project follows **Semantic Versioning (SemVer)** ([semver.org](https://semver.org/)), using the format:
 `[MAJOR].[MINOR].[PATCH]`
 - **MAJOR** (`X.0.0`) – Incompatible API/feature changes that break backward compatibility.
 - **MINOR** (`0.X.0`) – Backward-compatible new features, enhancements, or functionality changes.
 - **PATCH** (`0.0.X`) – Backward-compatible bug fixes, security updates, or minor corrections.
 - **Pre-release versions** – Use suffixes such as `-alpha`, `-beta`, `-rc.1` (e.g., `2.1.0-beta.1`).
 - **Build metadata** – If needed, use `+build` (e.g., `2.1.0+20250314`).

 ---

 ## [0.94.0] - 2025-09-18

 ### Features

 - Manage Incidents - only available to Admins
 - Incident logbook redesigned, Sort + Filter component added
 - Tasks promoted to full entity, extracted from Log Entries
 - Settings menu added with pipeline-stamped LISA version and Manage Profile/User Details
 - New Tasks screens featuring Add Task workflow, Task overview andd full list of all Tasks
 - Task updates happen inline as dropdown selectors (Status, Assignee)
 - Incident Overview redesigned with inline dropdown selector for Stage
 - Incident view redesigned with Sort + Filter component added
 - Burger menu and Header redesigned
 - Task Statuses can now no longer be updated backwards, must follow To Do -> In Progress -> Done flow
 - Location views redesigned, pins are per entity (Task, Log Entry) not at Incident level, also implemented for Tasks
 - Tasks can now have locations, attachments and sketches, along with tagging users as part of Task Description
 - Multiple location pincs can be added to a single Log Entry or Task
 - Only the assigned user can update a Task
 - Tagging functionality overhauled - now users select an entity type to tag and then select the entity to be tagged.
 - Recording moved away from  the Description field and into it's own Add Voice Recording section
 - Adding Incident redesigned to improve flow
 - Adding Log Entry redesigned to improve flow - includes "Forms" which comprise complicated log types + custom forms, and "Updates" for a more general quick log entry
 - Editing Incident redesigned to match Add Incident flow
 - Notifications view updated and redesigned
 - Notification badge disappears when notification has been "seen" (Notifications panel opened)


 ## [0.93.2] - 2025-07-18

 ### Features

 - Form validation improvements

 ### Fixes

 - Remove assignee link
 - Fix for saving of Form Templates and Risk Assessment
 - Log entries no longer require refresh to appear

 ## [0.93.1] - 2025-06-10

 ### Features

 - Add C4 diagrams to multitenancy documentation

 ## [0.93.0] - 2025-06-03

 ### Features

 - Add deployment resources for IWC LISA Instance

 ## [0.92.1] - [0.92.7] - 2025-05-16

 ### Bugfix

 - Missing Staging/Prod deployment scripts added for Hantsar LISA Instance

 ## [0.92.0] - 2025-05-15

 ### Features

 - Added Multi-instance support for multitenancy within LISA

 ### Bugfix

 - Fixed regression test pack

 ## [0.91.0] - 2025-04-17

 ### Features
 
 - Added Tasking workflow to allow Tasks to be created, assigned and updated
 - Added Incident sorting and filtering
 - Added form creation and form entry to L!SA
 
 ## [0.90.2] – 2025-03-28

 ### Bugfix

 - Fixed issue with editing incident (500 reported from logEntry endpoint)

 ## [0.90.1] – 2025-03-28

 ### Documentation

 - Updated User Guide


 ## [0.90.0] – 2025-03-28

 ### Initial Public Release (Pre-Stable)

 This is the first public release of this repository under NDTP's open-source governance model.
 Since this release is **pre-1.0.0**, changes may still occur that are **not fully backward-compatible**.

 #### Initial Features
 - Recording and managing incidents, including updating the current stage
 - Viewing incident details, including the incident overview, logbook, files, and locations
 - Searching and filtering the logbook within an incident
 - Capturing log entries within an incident, with the ability to tag other users, logs and files
 - Uploading files and audio recordings within a log entry, where they can then be viewed as an attachment to a log entry
 - Adding a sketch to a log entry, using the sketch tool, where they can then be viewed as an attachment to a log entry
 - Capturing location details within a log entry
 - Receiving in-system notifications when tagged within a log description

 #### Known Limitations
 - Some components are subject to change before `1.0.0`.
 - APIs may evolve based on partner feedback and internal testing.

 ---

 ## Future Roadmap to `1.0.0`

 The `0.90.x` series is part of NDTP’s **pre-stable development cycle**, meaning:
 - **Minor versions (`0.91.0`, `0.92.0`...) introduce features and improvements** leading to a stable `1.0.0`.
 - **Patch versions (`0.90.1`, `0.90.2`...) contain only bug fixes and security updates**.
 - **Backward compatibility is NOT guaranteed until `1.0.0`**, though NDTP aims to minimise breaking changes.

 Once `1.0.0` is reached, future versions will follow **strict SemVer rules**.

 ## Versioning Policy  
1. **MAJOR updates (`X.0.0`)** – Typically introduce breaking changes that require users to modify their code or configurations.  
   - **Breaking changes (default rule)**: Any backward-incompatible modifications require a major version bump.  
   - **Non-breaking major updates (exceptional cases)**: A major version may also be incremented if the update represents a significant milestone, such as a shift in governance, a long-term stability commitment, or substantial new functionality that redefines the project’s scope.   
2. **MINOR updates (`0.X.0`)** – New functionality that is backward-compatible.  
3. **PATCH updates (`0.0.X`)** – Bug fixes, performance improvements, or security patches.  
4. **Dependency updates** – A **major dependency upgrade** that introduces breaking changes should trigger a **MAJOR** version bump (once at `1.0.0`).  
---
## How to Update This Changelog  
1. When making changes, update this file under the **Unreleased** section.  
2. Before a new release, move changes from **Unreleased** to a new dated section with a version number.  
3. Follow **Semantic Versioning** rules to categorise changes correctly.  
4. If pre-release versions are used, clearly mark them as `-alpha`, `-beta`, or `-rc.X`.  
---
**Maintained by the National Digital Twin Programme (NDTP).**  
© Crown Copyright 2025. This work has been developed by the National Digital Twin Programme and is legally attributed to the Department for Business and Trade (UK) as the governing entity.  
Licensed under the Open Government Licence v3.0.  
For full licensing terms, see [OGL_LICENSE.md](OGL_LICENSE.md). 
