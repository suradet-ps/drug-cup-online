<!-- src/views/WaitingForApproval.vue -->
<template>
    <div class="wrapper">
        <div class="card content-card">
            <div class="header">
                <i class="fas fa-envelope-open-text icon-success"></i>
                <h1>ยืนยันอีเมลสำเร็จ!</h1>
            </div>
            <p class="message">
                ขอบคุณสำหรับการยืนยันอีเมล บัญชีของคุณถูกสร้างเรียบร้อยแล้ว
                และกำลังรอการตรวจสอบและอนุมัติจากผู้ดูแลระบบ
            </p>
            <p class="sub-message">
                คุณจะสามารถเข้าสู่ระบบได้หลังจากที่บัญชีของคุณได้รับการอนุมัติ
            </p>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-canvas);
    padding: var(--space-4);
}

.content-card {
    max-width: 500px;
    width: 100%;
    text-align: center;
    padding: var(--space-10);
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-sm);
    animation: fade-in var(--duration-slow) var(--easing-standard);
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.header {
    margin-bottom: var(--space-6);
}

.icon-success {
    font-size: 3rem;
    color: var(--color-status-fulfilled);
    margin-bottom: var(--space-4);
    display: block;
}

h1 {
    font-family: var(--font-body);
    font-size: var(--text-card-heading);
    font-weight: var(--weight-normal);
    letter-spacing: var(--tracking-card-heading);
    color: var(--color-ink);
    border: none;
    padding: 0;
    margin: 0;
}

.message {
    font-size: var(--text-body);
    color: var(--color-muted-slate);
    line-height: var(--leading-body);
    margin-bottom: var(--space-3);
}

.sub-message {
    font-size: var(--text-caption);
    color: var(--color-muted-slate);
    margin-bottom: var(--space-8);
}

.actions {
    margin-top: var(--space-6);
}

.actions .btn {
    width: 100%;
    padding: var(--space-3) var(--space-6);
    justify-content: center;
}
</style>
