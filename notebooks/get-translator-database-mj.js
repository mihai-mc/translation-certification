// Just run this from the Console at: https://www.just.ro/beta-interpreti-traducatori-rezultate/
(async () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const filters = {
        nume: "",
        idCurteApel: "-1",
        idLimba: "-1",
        idJudet: "-1",
        numar_autorizatie: "",
        telefon: ""
    };

    console.log("Getting total number of translators...");

    const countResponse = await fetch(
        "https://www.just.ro/mj-dmsws/int-mj/traducatori-count",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(filters)
        }
    );

    const countJson = await countResponse.json();

    if (countJson.result !== "OK") {
        console.error("Failed to obtain translator count:", countJson);
        return;
    }

    const total = Number(countJson.info);

    console.log(`Total translators: ${total}`);

    const all = [];

    for (let start = 1; start <= total; start += 50) {
        const end = Math.min(start + 50, total + 1);

        console.log(`Downloading ${start}-${end - 1}`);

        const response = await fetch(
            `https://www.just.ro/mj-dmsws/int-mj/traducatori-search?indexStart=${start}&indexEnd=${end}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify(filters)
            }
        );

        const json = await response.json();

        if (json.result !== "OK") {
            console.error("Request failed:", json);
            break;
        }

        all.push(...json.tertList);

        console.log(`Downloaded ${all.length}/${total}`);

        await sleep(500);
    }

    console.log(`Finished! Downloaded ${all.length} translators.`);

    const blob = new Blob(
        [JSON.stringify(all, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "traducatori.json";
    a.click();

    URL.revokeObjectURL(url);
})();