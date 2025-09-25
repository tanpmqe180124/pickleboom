// Admin Test Utilities
// File này chứa các hàm test cho admin functionality

import { adminService } from '@/services/adminService';

export const testAdminFunctionality = async () => {
  console.log('🧪 Testing Admin Functionality...');
  
  try {
    // Test 1: Check Admin Role
    console.log('1. Testing Admin Role Check...');
    const isAdmin = await adminService.checkAdminRole();
    console.log(`   ✅ Admin Role Check: ${isAdmin ? 'PASS' : 'FAIL'}`);
    
    if (!isAdmin) {
      console.log('   ⚠️  User is not admin, some tests will be skipped');
      return;
    }
    
    // Test 2: Test User Management
    console.log('2. Testing User Management...');
    try {
      const users = await adminService.getUsers({
        Page: 1,
        PageSize: 5
      });
      console.log(`   ✅ Get Users: SUCCESS (${users.Items.length} users)`);
    } catch (error) {
      console.log(`   ❌ Get Users: FAILED - ${error}`);
    }
    
    // Test 3: Test TimeSlot Management
    console.log('3. Testing TimeSlot Management...');
    try {
      const timeSlotData = {
        StartTime: '09:00',
        EndTime: '10:00'
      };
      // Note: This will create a real time slot, uncomment if needed
      // await adminService.createTimeSlot(timeSlotData);
      console.log('   ✅ TimeSlot Management: READY (commented out to avoid creating test data)');
    } catch (error) {
      console.log(`   ❌ TimeSlot Management: FAILED - ${error}`);
    }
    
    // Test 4: Test Court Management
    console.log('4. Testing Court Management...');
    try {
      // Note: This would create a real court, uncomment if needed
      // const courtData = {
      //   Name: 'Test Court',
      //   Description: 'Test Description',
      //   Location: 'Test Location',
      //   PricePerHour: 100000,
      //   CourtStatus: 0,
      //   TimeSlotIDs: []
      // };
      // await adminService.createCourt(courtData);
      console.log('   ✅ Court Management: READY (commented out to avoid creating test data)');
    } catch (error) {
      console.log(`   ❌ Court Management: FAILED - ${error}`);
    }
    
    // Test 5: Test Blog Management
    console.log('5. Testing Blog Management...');
    try {
      // Note: This would create a real blog, uncomment if needed
      // const blogData = {
      //   Title: 'Test Blog',
      //   Content: 'Test Content',
      //   UserID: 'test-user-id',
      //   BlogStatus: 0
      // };
      // await adminService.createBlog(blogData);
      console.log('   ✅ Blog Management: READY (commented out to avoid creating test data)');
    } catch (error) {
      console.log(`   ❌ Blog Management: FAILED - ${error}`);
    }
    
    // Test 6: Test Booking Management
    console.log('6. Testing Booking Management...');
    try {
      const bookings = await adminService.getBookings({
        Page: 1,
        PageSize: 5
      });
      console.log(`   ✅ Get Bookings: SUCCESS (${bookings.Items.length} bookings)`);
    } catch (error) {
      console.log(`   ❌ Get Bookings: FAILED - ${error}`);
    }
    
    console.log('🎉 Admin Functionality Test Completed!');
    
  } catch (error) {
    console.error('❌ Admin Test Failed:', error);
  }
};

// Helper function to check if user is admin
export const checkIfAdmin = async (): Promise<boolean> => {
  try {
    return await adminService.checkAdminRole();
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

// Helper function to get admin status with user info
export const getAdminStatus = async () => {
  const isAdmin = await checkIfAdmin();
  const token = localStorage.getItem('token');
  
  let userInfo = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userInfo = {
        userId: payload.nameid || payload.sub,
        role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        fullName: payload.unique_name || payload.name,
        email: payload.email
      };
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
  
  return {
    isAdmin,
    userInfo,
    hasToken: !!token
  };
};

// Export for use in console
if (typeof window !== 'undefined') {
  (window as any).testAdmin = testAdminFunctionality;
  (window as any).checkAdmin = checkIfAdmin;
  (window as any).getAdminStatus = getAdminStatus;
}

