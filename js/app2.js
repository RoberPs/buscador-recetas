


const iniciarApp = ()=>{


    const divResultado = document.getElementById('resultado')
        //obtener elemento del html y el contructor del modal para activar
    const modal = new bootstrap.Modal('#modal',{})

   

 /*    const obtenerCategorias =()=>{
    
         const url ='https://www.themealdb.com/api/json/v1/1/categories.php'
         fetch(url)
            .then(respuesta=> respuesta.json())
            .then(resultado=> mostrarCategorias(resultado.categories))
    } */

   
    const obtenerCategorias = async()=>{
        const url ='https://www.themealdb.com/api/json/v1/1/categories.php'
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCategorias(resultado.categories)
        
    }
    const mostrarCategorias =(categorias =[])=>{    
        categorias.forEach(categoria=>{
             /* console.log(categoria) */
            const{strCategory}=categoria;
         
            const option = document.createElement('OPTION')
            /* console.log(option) */
  
            option.value=strCategory;
              
            option.textContent =strCategory;
           
            selectorCategorias.appendChild(option)
        })
        
    }
    const seleccionarCategoria =async (e)=>{
       
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
         
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarRecetas(resultado.meals)
    
    } 
    const selectorCategorias = document.getElementById('categorias') 
    if(selectorCategorias){
        selectorCategorias.addEventListener('change',seleccionarCategoria);
        obtenerCategorias();
    }
    const mostrarRecetas =(recetas =[])=>{
        
        limpiarHtml(divResultado);
        
        const heading = document.createElement('H2')
        heading.classList.add('text-center','text-black','my-5')
        //Si recetas tiene contenido 
        heading.textContent= recetas.length ? 'Resultados' : 'No se encontraron recetas'
        divResultado.appendChild(heading)

        recetas.forEach(receta=>{

        const{idMeal,strMeal,strMealThumb}=receta

        const divReceta = document.createElement('DIV')
        divReceta.classList.add('col-md-4')
       
      
        const recetaCard = document.createElement('DIV')
        recetaCard.classList.add('card','mb-4')
        

        const recetaImagen = document.createElement('IMG')
        recetaImagen.classList.add('card-img-top');
        recetaImagen.alt=`Imagen de la receta :${strMeal ?? receta.nombre}`;
        recetaImagen.src= strMealThumb ?? receta.img;
        
        const recetaCardBody = document.createElement('DIV');
        recetaCardBody.classList.add('card-body');
         
        const recetaHeading = document.createElement('H3');
        recetaHeading.classList.add('card-title','mb-3','text-center')
        recetaHeading.textContent=strMeal ?? receta.nombre;

        const recetaBtn = document.createElement('BUTTON');
        recetaBtn.classList.add('btn','btn-outline-success','w-100');
        recetaBtn.textContent='Ver Receta';
        
        //Conectar con el modal de bootstrat
        recetaBtn.dataset.bsTarget ='#modal';
        recetaBtn.dataset.bsToggle ='modal';

        recetaBtn.onclick=()=>{seleccionarReceta(idMeal ?? receta.id)}

        recetaCardBody.appendChild(recetaHeading)
        recetaCardBody.appendChild(recetaBtn)

        recetaCard.appendChild(recetaImagen)
        recetaCard.appendChild(recetaCardBody)

        divReceta.appendChild(recetaCard)
       

        divResultado.appendChild(divReceta)
        
     })
      
    }
    const seleccionarReceta=async(idMeal)=>{
       const url =`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
       
       const respuesta = await fetch(url)
       const resultado = await respuesta.json()
       mostrarRecetaModal(resultado.meals[0])
    }
    const mostrarRecetaModal =(datosReceta)=>{
    
        const recetaDatos = datosReceta;
        console.log(recetaDatos)
        
     

        const{strIngredient,idMeal,strInstructions,strMeal,strMealThumb}=recetaDatos;
       /*  console.log(idMeal)
        console.log(strInstructions)
        console.log(strMeal)
        console.log(strMealThumb) */

        const modalTitle = document.querySelector('.modal .modal-title')
        modalTitle.innerHTML=strMeal;
        const modalBody = document.querySelector('.modal .modal-body')
        modalBody.innerHTML = `
             
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}"/>
            <h3 class='my-3'>Instrucciones:</h3>
            <h3 class="my-3">${strInstructions}</h3>
            <h3 class='my-3'>Ingredientes:</h3>
        `
       

        //Mostrar ingredientes
          
        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group')

        for(let i = 1; i<=20; i++){
        
           /* console.log(recetaDatos[`strIngredient${i}`]) */
             
          if(recetaDatos[`strIngredient${i}`]) {
               const ingrediente = recetaDatos[`strIngredient${i}`];
               const cantidad = recetaDatos[`strMeasure${i}`]
               
               const ingredienteLi = document.createElement('LI');
               ingredienteLi.textContent = `${ingrediente} - ${cantidad}`
               ingredienteLi.classList.add('list-group-item');
                 
               listGroup.appendChild(ingredienteLi)

               /* console.log(`${ingrediente} - ${cantidad}`) */
          }  
            
        }

        modalBody.appendChild(listGroup)
        
        //Botones modal

        const modalFooter = document.querySelector('.modal .modal-footer')

        limpiarHtml(modalFooter)

        const btnFavorito = document.createElement('button');
        btnFavorito.classList.add('btn','btn-danger','col')
        btnFavorito.textContent= existeStorage(idMeal) ? 'Eliminar Favorito':'Guardar Favorito';
        
        //Almacenar en localStorage
        btnFavorito.onclick=()=>{
            
            /* console.log(existeStorage(idMeal)) */
            //Guardar o eliminar favorito
            if(existeStorage(idMeal)){
                eliminarFavorito(idMeal);
                //Cuando se elimina la receta aparece el boton guargar
                btnFavorito.textContent ='Guardar Favorito'
                btnFavorito.classList.add('btn-danger')
                mostrarToast('Receta elminada correctamente')
                return;
                 //Detiene la ejecución del codigo y no se agregan mas favoritos
            }

            agregarFavorito({
              id:idMeal,
              nombre:strMeal,
              img:strMealThumb
            });
             //Cuando se guarga la receta aparece el boton eliminar
             btnFavorito.classList.add('btn-warning')
             btnFavorito.classList.remove('btn-danger')
             btnFavorito.textContent ='Eliminar Favorito'
             mostrarToast('Receta guardada en favoritos')
             
        }   

        const btnCerrar = document.createElement('button');
        btnCerrar.classList.add('btn','btn-secondary','col')
        btnCerrar.textContent='Cerrar';
        btnCerrar.onclick=()=>{
            modal.hide();
        }

        modalFooter.appendChild(btnFavorito)
        modalFooter.appendChild(btnCerrar)

        //mostrar modal

        modal.show();

    }
    const agregarFavorito=(objReceta)=>{
    
     //Obtiene el arreglo de local storage y si no existe crea uno vacio
     const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
     console.log(favoritos)
     //Convertimos a string para poder almacenarlo LOCALSTORAGE SOLO ALMACENA STRINGS
     localStorage.setItem('favoritos',JSON.stringify([...favoritos, objReceta]));
    }
    const eliminarFavorito = (id)=>{
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? []; 
        const nuevosFavoritos = favoritos.filter(favorito=>favorito.id !==id);
        localStorage.setItem('favoritos',JSON.stringify(nuevosFavoritos))
    }
    const existeStorage=(id)=>{
        //si tenemos elementos los obtiene y si no la parte derecha 
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        // comprobamos si el id ya existe y esta repetido
        return favoritos.some(favorito => favorito.id ===id);
        //some nos retorna un true o false
    }
    const  mostrarToast = (mensaje)=>{
       const toastDiv = document.querySelector('#toast')
       const bodyToast = document.querySelector('.toast-body')
       const toast = new bootstrap.Toast(toastDiv);
         
       bodyToast.textContent=mensaje;
       
       toast.show()
    }

    const limpiarHtml=(selector)=>{
        //Pasamos un pararmetro para poder reutilizar la función 
         while(selector.firstChild){
             selector.removeChild(selector.firstChild)
  
         }
     
    }

    const obtenerFavoritos=()=>{
    
         const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
         console.log(favoritos)

         if(favoritos.length){
            mostrarRecetas(favoritos)
             
        
         }else{
           
            const msjNoFavoritos = document.createElement('P');
            msjNoFavoritos.classList.add('fw-bold','text-center','fs-5');
            msjNoFavoritos.textContent='No se han encontrado favoritos';
            favoritosDiv.appendChild(msjNoFavoritos)
        }
        
    }
    const favoritosDiv = document.querySelector('.favoritos');
    
    if(favoritosDiv){
       obtenerFavoritos();
    
    }

}

document.addEventListener('DOMContentLoaded',iniciarApp);
