<script lang="ts">
	type Props = {
		code: string;
		title?: string;
	};

	let { code, title = 'The code' }: Props = $props();

	const displayCode = $derived(code.trim());
	let copied = $state(false);

	async function copyCode(): Promise<void> {
		try {
			await navigator.clipboard.writeText(displayCode);
			copied = true;

			window.setTimeout(function () {
				copied = false;
			}, 1500);
		} catch {
			copied = false;
		}
	}
</script>

<figure class="code-card">
	<figcaption class="code-bar">
		<span>{title}</span>
		<button class="btn btn-sm" type="button" onclick={copyCode}>
			{copied ? 'Copied!' : 'Copy'}
		</button>
	</figcaption>
	<pre><code>{displayCode}</code></pre>
</figure>
