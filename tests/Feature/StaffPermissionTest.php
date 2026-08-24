<?php

use App\Models\User;
use Database\Seeders\StaffPermissionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->withoutVite();
    foreach (['admin', 'mentor', 'affiliate', 'user', 'staff'] as $role) {
        Role::firstOrCreate(['name' => $role]);
    }
    $this->seed(StaffPermissionSeeder::class);
});

test('admin can access staff management index', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get(route('staff.index'))
        ->assertOk();
});

test('admin can create staff and assign permissions', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $staffData = [
        'name' => 'Staff Baru',
        'email' => 'staff.baru@example.com',
        'phone_number' => '081234567890',
        'instance' => 'Level Up',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'permissions' => ['courses.view', 'courses.manage', 'users.view'],
    ];

    $this->actingAs($admin)
        ->post(route('staff.store'), $staffData)
        ->assertRedirect(route('staff.index'));

    $staff = User::where('email', 'staff.baru@example.com')->first();
    expect($staff)->not->toBeNull();
    expect($staff->hasRole('staff'))->toBeTrue();
    expect($staff->hasPermissionTo('courses.view'))->toBeTrue();
    expect($staff->hasPermissionTo('courses.manage'))->toBeTrue();
    expect($staff->hasPermissionTo('users.view'))->toBeTrue();
    expect($staff->hasPermissionTo('webinars.view'))->toBeFalse();
});

test('staff can access routes with granted permissions', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');
    $staff->givePermissionTo('courses.view');

    $this->actingAs($staff)
        ->get(route('courses.index'))
        ->assertOk();
});

test('staff is forbidden from routes without permission', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');
    $staff->givePermissionTo('courses.view');

    // Does not have webinars.view permission
    $this->actingAs($staff)
        ->get(route('webinars.index'))
        ->assertForbidden();
});

test('staff is forbidden from accessing staff management', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');
    $staff->givePermissionTo('users.view');

    $this->actingAs($staff)
        ->get(route('staff.index'))
        ->assertForbidden();
});

test('staff dashboard renders correctly for staff role', function () {
    $staff = User::factory()->create();
    $staff->assignRole('staff');
    $staff->givePermissionTo(['courses.view', 'bootcamps.view']);

    $this->actingAs($staff)
        ->get(route('dashboard'))
        ->assertOk();
});
