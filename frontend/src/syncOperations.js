import { db } from './localDB';
import { BACKEND_URL } from './config';
import {objectToFormData} from './formdataSerialization';

export async function queueOperation(type, payload) {
    console.log('inside queue operation');
    await db.pendingOperations.add({ type, payload });
}

export async function syncPendingOperations() {
    console.log('inside sync pending');
    const operations = await db.pendingOperations.toArray();

    for (const op of operations) {
        try {
            let response;

            if (op.type === 'create') {
                const formData = objectToFormData(op.payload);
                response = await fetch(`${BACKEND_URL}/review`, {
                    method: 'POST',
                    body: formData
                });
            }

            if (op.type === 'update') {
                response = await fetch(`${BACKEND_URL}/review/${op.payload.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(op.payload),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                });
            }

            if (op.type === 'delete') {
                response = await fetch(`${BACKEND_URL}/review/${op.payload}`, {
                    method: 'DELETE'
                });
            }

            if (response.ok) {
                console.log("Attempting to delete op:", op.id);
                await db.pendingOperations.delete(op.id);
                console.log("Deleted op:", op.id);
            }
            else {
                // Safely try to get error details
                let errorMessage = 'Unknown server error';
                try {
                    const responseData = await response.json();
                    errorMessage = responseData?.message || errorMessage;
                } catch {
                    errorMessage = response.statusText;
                }
                throw new Error(`❌ Failed to sync [${op.type}] - ${errorMessage}`);
            }   

        } catch (error) {
            console.log(error.message);
        }
  }
}
