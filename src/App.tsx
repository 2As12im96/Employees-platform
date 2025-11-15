import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Login from "./components/Authentication/Login/login";
import EmployeeDashboard from "./components/EmployeeDashboard/employeeDashboard";
import EmployeeSummery from "./components/EmployeeDashboard/employee-panel/summery/Summery";
import LeaveList from "./components/EmployeeDashboard/employee-panel/Leaves/LeaveList";
import AddLeaves from "./components/EmployeeDashboard/employee-panel/Leaves/AddLeaves";
import EmployeeSetting from "./components/EmployeeDashboard/employee-panel/Setting/Setting";
import Summery from "./components/AdminDashboard/Dashboard/Summery/Summery";
import Employee from "./components/AdminDashboard/Dashboard/Employee/Employee";
import View from "./components/AdminDashboard/Dashboard/Employee/ViewEmployee";
import AddEmpolyee from "./components/AdminDashboard/Dashboard/Employee/AddEmpolyee";
import EditEmployee from "./components/AdminDashboard/Dashboard/Employee/EditEmployee";
import Departments from "./components/AdminDashboard/Dashboard/Department/Departments";
import AddDepartment from "./components/AdminDashboard/Dashboard/Department/AddDepartment";
import EditDepartment from "./components/AdminDashboard/Dashboard/Department/EditDepartment";
import Leaves from "./components/AdminDashboard/Dashboard/Leaves/Leaves";
import Salary from "./components/AdminDashboard/Dashboard/Salary/ِAddSalary";
import ViewSalary from "./components/AdminDashboard/Dashboard/Salary/ViewSalary";
import PrivatedRoutes from "./utils/PrivatedRoutes";
import RouleBaseRoute from "./utils/RouleBaseRoute";
import LeaveDetails from "./components/AdminDashboard/Dashboard/Leaves/LeaveDetails";
import EmployeeAttendancePortal from "./components/Attendence/Employee Attendences/EmployeeAttendancePortal";
import Attendence from "./components/Attendence/Admin Attendences/Attendence";
import EmployeeReportViewer from "./components/Attendence/Employee Attendences/EmployeeReportViewer";
import IndividualEmployeeReportAdmin from "./components/AdminDashboard/Dashboard/Employee/IndividualEmployeeReportAdmin";
import SimpleReportFetcher from "./components/Attendence/Admin Attendences/Attendence";
import {jwtDecode} from 'jwt-decode';


const App: React.FC = () => {
  let userRole = 'guest';
  const token = localStorage.getItem('token');

  if (token) {
      try {
          const decoded = jwtDecode(token) as { role: string };
          userRole = decoded.role;
      } catch (e) {
          console.error("Invalid token");
      }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />} ></Route>

        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={
          <PrivatedRoutes>
            <RouleBaseRoute requiredRole={['admin']}>
              <AdminDashboard />
            </RouleBaseRoute>
          </PrivatedRoutes>
        }>
            <Route index element={<Summery />}></Route>
          
            {/* Employees Admin */}
            <Route path="/admin-dashboard/employees" element={<Employee/>}></Route>
            <Route path="/admin-dashboard/employees/:id" element={<View userRole={userRole}/>}></Route>
            <Route path="/admin-dashboard/add-employees" element={<AddEmpolyee/>}></Route>
            <Route path="/admin-dashboard/employees/edit/:id" element={<EditEmployee/>}></Route>
          
            {/* Departments Admin */}
            <Route path="/admin-dashboard/departments" element={<Departments/>}></Route>
            <Route path="/admin-dashboard/add-department" element={<AddDepartment/>}></Route>
            <Route path="/admin-dashboard/department/:id" element={<EditDepartment/>}></Route>
            
            {/* Leaves Admin  */}
            <Route path="/admin-dashboard/leaves" element={<Leaves/>}></Route>
            <Route path="/admin-dashboard/leaves/:id" element={<LeaveDetails/>}></Route>
            <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />}></Route>
            
            {/* Salaries Admin  */}
            <Route path="/admin-dashboard/salary/add" element={<Salary/>}></Route>
            <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary/>}></Route>
            
            {/* Attendences */}
            <Route path="/admin-dashboard/attendence" element={<Attendence/>}></Route>
            <Route path="/admin-dashboard/attendence" element={<SimpleReportFetcher/>}></Route>
            <Route path="/admin-dashboard/attendence-report/employee/:employeeId/:year/:month" element={<IndividualEmployeeReportAdmin />}></Route>
          
            {/* Setting Admin  */}
            <Route path="/admin-dashboard/settings" element={<EmployeeSetting/>}></Route>

        </Route>

        {/* Employees Dashboard */}
        <Route path="/employee-dashboard" element={
          <PrivatedRoutes>
              <RouleBaseRoute requiredRole={['admin' ,'employee']}>
                <EmployeeDashboard />
              </RouleBaseRoute>
          </PrivatedRoutes>
          }>
          <Route index element={<EmployeeSummery />}></Route>
          <Route path="/employee-dashboard/profile/:id" element={<View userRole={userRole}/>}></Route>
          <Route path="/employee-dashboard/leaves/:id" element={<LeaveList/>}></Route>
          <Route path="/employee-dashboard/add-leaves" element={<AddLeaves/>}></Route>
          <Route path="/employee-dashboard/salary/:id" element={<ViewSalary/>}></Route>
          
          {/* Employee Attendence */}
          <Route path="/employee-dashboard/attendence" element={<EmployeeAttendancePortal/>}></Route>
          <Route path="/employee-dashboard/attendence-report/:year/:month" element={<EmployeeReportViewer />}></Route>

          <Route path="/employee-dashboard/setting" element={<EmployeeSetting/>}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;