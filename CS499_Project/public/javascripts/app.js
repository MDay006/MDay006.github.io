let auth = null;
try { auth = requireAuth(); } catch(e) { }
document.getElementById('who').textContent = auth ? `Logged in as ${auth.user.username} (${auth.user.role})` : '';
document.getElementById('logout').addEventListener('click', () => { clearAuth(); window.location.href='login.html'; });

const itemForm = document.getElementById('itemForm');
const itemIdInput = document.getElementById('itemId');
const nameInput = document.getElementById('itemName');
const qtyInput = document.getElementById('itemQty');
const cancelEditBtn = document.getElementById('cancelEdit');
const itemsContainer = document.getElementById('itemsContainer');

async function loadItems(){
  const res = await authFetch('/api/items');
  if(!res.ok){ const d=await res.json(); alert(d.error||'Error'); return; }
  const data = await res.json();
  itemsContainer.innerHTML = '';
  data.forEach(userData => {
    const block = 
    document.createElement('div'); block.className='user-block';
    const header = 
    document.createElement('h3'); header.textContent = `User: ${userData.username}`; block.appendChild(header);

    if(!userData.items || userData.items.length===0){ 
      const p=document.createElement('p'); p.textContent='(no items)'; block.appendChild(p); 
    } else {
      userData.items.forEach(it=>{
        const row=document.createElement('div'); row.className='item-row';
        const info=document.createElement('div'); info.textContent=`${it.name} — Qty: ${it.quantity}`; 
        row.appendChild(info);
        if(auth.user.role==='admin' || auth.user.username===userData.username){
          const editBtn=document.createElement('button'); editBtn.textContent='Edit'; 
          editBtn.onclick=()=>{ itemIdInput.value=it._id; nameInput.value=it.name; 
          qtyInput.value=it.quantity; }; 
          row.appendChild(editBtn);
        }
        if(auth.user.role==='admin'){
          const delBtn=document.createElement('button'); 
          delBtn.textContent='Delete'; 
          delBtn.onclick=async ()=>{ 
            if(!confirm('Delete this item?')) return; 
            const res2=await authFetch(`/api/items/${userData._id}/${it._id}`,{method:'DELETE'});
            if(!res2.ok){
              const d=await res2.json(); 
              alert(d.error||'Delete failed'); 
            return; }
            loadItems();}; 
          row.appendChild(delBtn);
        }
        block.appendChild(row);
      });
    }
    itemsContainer.appendChild(block);
  });
}

itemForm.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const id=itemIdInput.value; 
  const name=nameInput.value.trim(); 
  const quantity=Number(qtyInput.value);
  
  if(!name) return alert('Name required');
  if(id){
    const res=await authFetch(`/api/items/${id}`,{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,quantity})});
    if(!res.ok){ const d=await res.json(); 
      return alert(d.error||'Update failed'); }
  } else {
    const res=await authFetch('/api/items',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,quantity})});
    if(!res.ok){ const d=await res.json(); 
      return alert(d.error||'Create failed'); }
  }
  itemForm.reset(); itemIdInput.value=''; loadItems();
});

cancelEditBtn.addEventListener('click', ()=>{ itemForm.reset(); itemIdInput.value=''; });
loadItems();
