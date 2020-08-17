<template>
  <div>
    <label>Username: </label>
    <input type="text" v-model="username">
    <br>
    <label>Password: </label>
    <input type="password" v-model="password">
    <br>

    <button @click="updateInfo()">Create User</button>
  </div>
</template>

<script>
export default {
name: "Login"
}
</script>

<style scoped>

</style>