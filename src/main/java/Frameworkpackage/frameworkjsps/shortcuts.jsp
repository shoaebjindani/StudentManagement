<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Person and Phone Numbers</title>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f9fc;
            margin: 0;
            padding: 0;
        }

        h2 {
            text-align: center;
            color: #003366;
            margin-top: 40px;
            font-size: 2em;
            font-weight: 600;
        }

        table {
            width: 80%;
            margin: 40px auto;
            border-collapse: collapse;
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        th,
        td {
            padding: 15px;
            text-align: left;
            font-size: 1em;
        }

        th {
            background-color: #003366;
            color: white;
            font-size: 1.1em;
        }

        td {
            background-color: #e6f2ff;
            color: #003366;
        }

        tr:nth-child(even) td {
            background-color: #d6eaff;
        }

        tr:hover td {
            background-color: #cce0ff;
            cursor: pointer;
        }

        .footer {
            text-align: center;
            font-size: 0.9em;
            color: #777;
            margin-top: 50px;
        }

        .footer a {
            color: #003366;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .table-container {
            padding: 20px;
        }

        /* Custom styling for table */
        .shortcut-table th, .shortcut-table td {
            border: 1px solid #ddd;
            padding: 12px 20px;
        }
    </style>
</head>

<body>

   

    <div class="table-container">
        <table class="shortcut-table">
            <thead>
                <tr>
                    
                    <th>Shortcut Combination</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <%
                    // Example data: Array of names and phone numbers
                    String[][] data = {
                        {"Ctrl + Shift + H","Takes you to the home page"},
                        {"Ctrl + Shift + F","Focuses on the element search textbox"},
                        {"Ctrl + Shift + L","Logs you out of the application"},
                        {"Alt + Left Arrow","Takes you to the Previous page"}

                    };

                    // Loop through the data and display in the table
                    for (int i = 0; i < data.length; i++) {
                %>
                <tr>
                    <td><%= data[i][0] %></td>
                    <td><%= data[i][1] %></td>
                </tr>
                <% } %>
            </tbody>
        </table>
    </div>

    <!-- Footer Section -->


    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js"></script>
    <script>
        $(function () {
            $('#example1').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": false,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "pageLength": 100
            });
        });

        document.getElementById("divTitle").innerHTML="Shortcuts";

    </script>

</body>

</html>
