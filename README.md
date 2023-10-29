# Supply Chain Management System

## Project Overview

Supply Chain Management System is a comprehensive software solution designed for Company A, a production company based in Kandy. The company operates with a complex supply chain that utilizes the railway system to distribute its products to customers islandwide. This system is designed to optimize and streamline the entire supply chain process, from order management to delivery.

### Features

1. **Railway Transportation Management:** 
    - Allocate and manage transportation capacity on railway trips.
    - Schedule orders for the next trip when the capacity allocated is exceeded.
    - Define train capacity consumption for each product.
   
2. **Distribution via Trucks:**
    - Utilize trucks for delivering orders from a store to customer addresses.
    - Assign trucks to specific routes, ensuring efficient delivery coverage.
    - Set maximum time limits for completing each route.

3. **Driver and Driver Assistant Rosters:**
    - Manage driver and driver assistant assignments according to their respective rosters.
    - Enforce constraints, such as no consecutive truck schedule assignments for drivers and a maximum of two consecutive turns for driver assistants.
    - Ensure total work hours per driver do not exceed 40 hours per week and 60 hours per week for driver assistants.

4. **Order Placement:**
    - Customers can place orders, selecting a route based on their delivery address.
    - Orders must be placed at least 7 days prior to the delivery date.

5. **Reporting and Analytics:**
    - Generate various reports for management and analytics, including:
        - Quarterly sales report for a given year.
        - Items with the most orders.
        - Sales report categorized by main cities and routes.
        - Working hours of drivers, driver assistants, and used hours of trucks.
        - Order reports for detailed tracking.

6. **Customer Management:**
    - Store and manage customer data, including wholesalers, retailers, and end customers.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/your-username/supply-chain-management.git
   ```

2. Install the necessary dependencies and set up the database.

3. Configure the application settings, including railway capacity, truck routes, and driver rosters.

4. Run the application.

## Contributing

This is a supply chain management system developed by students of University of Moratuwa

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact our team at support@companyA.com.

---

*Note: This README is a general template and should be customized to match the specifics of your project and organization.*