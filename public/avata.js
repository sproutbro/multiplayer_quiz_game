const shop_container = document.querySelector(".shop_container");
const avata_container = document.querySelector(".avata_container");
const avata_skin = document.querySelector(".avata_skin");
const avata_hair = document.querySelector(".avata_hair");
const avata_clothing = document.querySelector(".avata_clothing");
const avata_accessories = document.querySelector(".avata_accessories");
const avata_form = document.getElementById("avata_form");

shop_container.addEventListener("click", (e) => {
  if (e.target.src) {
    if (e.target.alt === "hair") {
      avata_hair.src = e.target.src;
      avata_form.hair.value = avata_hair.src;
    }
    if (e.target.alt === "skin") {
      avata_skin.src = e.target.src;
      avata_form.skin.value = avata_skin.src;
    }
    if (e.target.alt === "clothing") {
      avata_clothing.src = e.target.src;
      avata_form.clothing.value = avata_clothing.src;
    }
    if (e.target.alt === "accessories") {
      avata_accessories.src = e.target.src;
      avata_form.accessories.value = avata_accessories.src;
    }
  }
});