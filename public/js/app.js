// API 기본 URL 설정
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://nestjstest.netlify.app'; // 여기에 실제 백엔드 URL을 입력하세요

// API 응답을 표시하는 유틸리티 함수
function showApiResponse(response, error = false) {
    const responseDiv = document.getElementById('apiResponse');
    responseDiv.textContent = JSON.stringify(response, null, 2);
    responseDiv.className = error ? 'error' : 'success';
    setTimeout(() => {
        responseDiv.textContent = '';
        responseDiv.className = '';
    }, 3000);
}

// 사용자 관련 함수들
async function createUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        age: parseInt(formData.get('age'))
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '사용자 생성 실패');
        }
        
        showApiResponse(data);
        event.target.reset();
        loadUsers();
    } catch (error) {
        showApiResponse({ error: error.message }, true);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = users.map(user => `
            <li>
                ${user.name} (${user.email}) - ${user.age}세
                <button onclick="deleteUser(${user.id})">삭제</button>
            </li>
        `).join('');
    } catch (error) {
        showApiResponse({ error: error.message }, true);
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('사용자 삭제 실패');
        }

        showApiResponse({ message: '사용자가 성공적으로 삭제되었습니다.' });
        loadUsers();
    } catch (error) {
        showApiResponse({ error: error.message }, true);
    }
}

// 주문 관련 함수들
async function createOrder(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const orderData = {
        userId: parseInt(formData.get('userId')),
        productName: formData.get('items'),
        quantity: parseInt(formData.get('quantity')),
        totalAmount: parseFloat(formData.get('totalAmount'))
    };

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '주문 생성 실패');
        }
        
        showApiResponse(data);
        event.target.reset();
        loadOrders();
    } catch (error) {
        showApiResponse({ error: error.message }, true);
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        const orders = await response.json();
        
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = orders.map(order => `
            <li>
                주문 #${order.id} - 사용자 ID: ${order.userId}
                <br>상품: ${order.productName}
                <br>수량: ${order.quantity}개
                <br>총액: ₩${order.totalAmount.toLocaleString()}
                <br>상태: ${order.status}
                <select onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>대기중</option>
                    <option value="PROCESSING" ${order.status === 'PROCESSING' ? 'selected' : ''}>처리중</option>
                    <option value="COMPLETED" ${order.status === 'COMPLETED' ? 'selected' : ''}>완료</option>
                    <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>취소됨</option>
                </select>
                <button onclick="deleteOrder(${order.id})">삭제</button>
            </li>
        `).join('');
    } catch (error) {
        showApiResponse({ error: error.message }, true);
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('주문 상태 업데이트 실패');
        }

        const data = await response.json();
        showApiResponse(data);
        loadOrders();
    } catch (error) {
        showApiResponse({ error: error.message }, true);
    }
}

async function deleteOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('주문 삭제 실패');
        }

        showApiResponse({ message: '주문이 성공적으로 삭제되었습니다.' });
        loadOrders();
    } catch (error) {
        showApiResponse({ error: error.message }, true);
    }
}

// 페이지 로드 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 사용자 폼 이벤트 리스너
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', createUser);
        loadUsers();
    }

    // 주문 폼 이벤트 리스너
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', createOrder);
        loadOrders();
    }
});