import { burger } from './src/burger';
import { pagination } from './src/pagination';

// Simply run the burger menu
burger();


let pageRoot = document.getElementById("pagination");

// If the pagination element is there, run pagination script
if (pageRoot) {
    pagination(pageRoot);
}

const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener("click", () => {
    // File
}
,false)


