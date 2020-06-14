import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Parent
} from '@nestjs/graphql';
import { User, UserRole, Account } from 'src/models';
import { UserService } from '../';
import { UserRoleArgs, FindManyUserArgs } from './dto';
import { FindOneArgs } from 'src/dto';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UseGuards, UseFilters } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver(() => User)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, {
    nullable: true,
    description: undefined
  })
  async user(
    @Context() ctx: any,
    @Args() args: FindOneArgs
  ): Promise<User | null> {
    return this.userService.user(args);
  }

  @Query(() => [User], {
    nullable: false,
    description: undefined
  })
  async users(
    @Context() ctx: any,
    @Args() args: FindManyUserArgs
  ): Promise<User[]> {
    return this.userService.users(args);
  }

  @Mutation(() => User, {
    nullable: true,
    description: undefined
  })
  async assignRoleToUser(
    @Context() ctx: any,
    @Args() args: UserRoleArgs
  ): Promise<User | null> {
    return this.userService.assignRole(args);
  }

  @Mutation(() => User, {
    nullable: true,
    description: undefined
  })
  async removeRoleFromUser(
    @Context() ctx: any,
    @Args() args: UserRoleArgs
  ): Promise<User | null> {
    return this.userService.removeRole(args);
  }

  @ResolveProperty('userRoles', () => [UserRole])
  async userRoles(@Parent() user: User) {
    return await this.userService.getRoles(user.id);
  }

  @ResolveProperty('account', () => Account)
  async account(@Parent() user: User) {
    return await this.userService.getAccount(user.id);
  }
}