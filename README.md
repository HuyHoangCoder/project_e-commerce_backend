controllers

order.js

<aside>
💡

```jsx
  

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  
  if (!status) throw new Error('Missing status');
  
  const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
  
  return res.json({
    success: response ? true : false,
    response: response ? response : 'Something went wrong',
  });
});

```

</aside>

routers

order.js

<aside>
💡

```jsx
router.put('/status/:oid',  [verifyAccessToken, isAdmin], ctrls.updateStatus); 

```

</aside>
