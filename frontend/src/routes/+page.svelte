<script lang="ts">
	import { onMount } from 'svelte';
	
	const API_BASE_URL = 'http://localhost:8000';
	
    // TODO: separate responsabilities (creating a service?)
	// Simple function to test backend connection
	async function testBackendConnection() {
		try {
            // TODO: manage routes as constants
			const response = await fetch(`${API_BASE_URL}/api/files`);  
			
			if (response.ok) {
				const data = await response.json();
                console.log(data);
			}
		} catch (err) {
			console.error('Error connecting to backend:', err);
		}
	}
	
	onMount(() => {
		testBackendConnection();
	});
</script>

<div class="p-8">
	<h1 class="text-2xl font-bold mb-4">Google Drive Clone - Frontend</h1>
</div>
