## Introduction
This project is a web application for managing business card information, focusing on clean code and modern design principles. The backend APIs are built using C# and .NET Core, with the option to use SQL Server  as the database.
The frontend  was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.8.

## System Requirements
- **Environment:** .NET Core (version 8.0)
- **Frontend:** Angular
- **Database:** SQL Server
- **Photo Encoding:** Base64

## Features
- **Add New Business Card:** Accept input from the user interface or through file import (XML, CSV, QR code).
- **View Business Cards:** API to list all stored business cards as table or cards.
- **Delete Business Card:** API to delete a specific card.
- **Export Business Cards:** Export to XML and CSV formats.
- **Optional Filtering:** Filter business cards by name, phone, email.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Database Backup

### Description
The backup file `task1.bak` contains all the data related to business cards stored in the database.

### How to Use the Backup File
1. Open SQL Server Management Studio (SSMS).
2. Connect to your database server.
3. Right-click on "Databases" and select "Restore Database".
4. Select "Device" and then click on the ellipsis (...) to browse for the backup file.
5. Select the backup file `task1.bak` and click "OK".
6. Follow the prompts to complete the restore process.

### Warnings
- Restoring the backup will overwrite any existing data in the database. Ensure that you have a backup of the current data before proceeding.

### System Requirements
- Ensure you are using a compatible version of SQL Server for restoring this backup file.



## Notes on Uploading Files

Please ensure that the column headers in the Excel files match those in `cardDTO`. The headers should be as follows:

- **Fname**
- **Lname**
- **Email**
- **Gender**
- **Phone**
- **Phone2**

To ensure everything works correctly, it is recommended to extract a file from the website and use it as a reference for matching.

## Excel File
You can download the Excel file [here](link-to-your-excel-file).

