
        
        document.querySelector('#regrasBtn').addEventListener('click', function(){
            const dialog = document.querySelector('#dialogRegras');
            dialog.showModal();  // Abre o diálogo
        });

        
        document.querySelector('#fecharDialog').addEventListener('click', function(){
            const dialog = document.querySelector('#dialogRegras');
            dialog.close();  // Fecha o diálogo
        });