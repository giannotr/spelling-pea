export async function checkTermDefined(term: string) {
	try {
		const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
		const json = await response.json();

		let isSuccess = false;
		
		const [firstResult] = json;

		if(
			!!firstResult &&
			typeof firstResult === 'object' &&
			firstResult.hasOwnProperty('word')
		) {
			isSuccess = true;
		}

		return(isSuccess);
	} catch(_error) {
		return(false);
	}
}
