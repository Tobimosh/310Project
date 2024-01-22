console.log("Service worker loaded...");




self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push received...");
    self.registration.showNotification(data.title, {
        body: data.description,
        // icon: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.lockheedmartin.com%2Fcontent%2Fdam%2Flockheed-martin%2Fau%2Fphoto%2F2023%2Fnews%2FF35-LMA-800.jpg&tbnid=LJtQ0XGtcGh8jM&vet=12ahUKEwjaiLDDkeyDAxUArycCHXhtBiAQMygEegQIARB7..i&imgrefurl=https%3A%2F%2Fwww.lockheedmartin.com%2Fen-us%2Fproducts%2Ff-35.html&docid=l2vNjBkYLXJvjM&w=800&h=563&q=f35&ved=2ahUKEwjaiLDDkeyDAxUArycCHXhtBiAQMygEegQIARB7"
    })
})